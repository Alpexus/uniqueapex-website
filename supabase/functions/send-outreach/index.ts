// ============================================================
// send-outreach — the automated outreach engine (edge function).
// Deploy:  supabase functions deploy send-outreach
// Secrets: RESEND_API_KEY (already set for the waitlist emails);
//          SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are provided
//          automatically by the platform.
//
// What it does, in order — ALL enforcement lives here (server-side,
// tamper-proof), the UI only mirrors it:
//   1. Verifies the caller's JWT → user.
//   2. Loads their plan from subscriptions (default free).
//   3. QUOTA: free = 1 batch per service type ever;
//             premium/family = 1 batch per service type per 30 days.
//   4. 90-DAY PROTECTION: excludes any provider already contacted
//      about this child in the last 90 days.
//   5. Picks up to 5 active providers of that service type.
//   6. Sends each a personalized intro via Resend (Reply-To = the
//      parent), plus a confirmation email to the parent.
//   7. Records outreach_requests + outreach_contacts.
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const SERVICE_LABEL: Record<string, string> = {
  slp: "speech-language therapy",
  ot: "occupational therapy",
  aba: "behaviour support",
  psych: "psychological services",
  social: "social skills groups",
};
const BATCH_SIZE = 5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1 · who is calling?
    const jwt = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) return json({ error: "auth" }, 401);
    const user = userData.user;

    const { passport_id, service_type } = await req.json();
    if (!passport_id || !SERVICE_LABEL[service_type]) return json({ error: "bad_request" }, 400);

    // the passport must belong to the caller
    const { data: passport } = await admin.from("passports")
      .select("id,user_id,data").eq("id", passport_id).single();
    if (!passport || passport.user_id !== user.id) return json({ error: "not_yours" }, 403);

    // 2 · plan
    const { data: sub } = await admin.from("subscriptions")
      .select("plan,current_period_end").eq("user_id", user.id).maybeSingle();
    const active = sub && (!sub.current_period_end || new Date(sub.current_period_end) > new Date());
    const plan = active ? sub!.plan : "free";

    // 3 · quota
    const { data: prior } = await admin.from("outreach_requests")
      .select("id,created_at").eq("passport_id", passport_id)
      .eq("service_type", service_type).order("created_at", { ascending: false });
    if (plan === "free" && prior && prior.length > 0) {
      return json({ error: "quota", plan, message: "The free plan includes one automated batch per service type — upgrade to send follow-up rounds." }, 402);
    }
    if (plan !== "free" && prior && prior.length > 0) {
      const last = new Date(prior[0].created_at).getTime();
      if (Date.now() - last < 30 * 864e5) {
        const days = Math.ceil((30 * 864e5 - (Date.now() - last)) / 864e5);
        return json({ error: "cooldown", days, message: `The last ${SERVICE_LABEL[service_type]} batch went out recently — the next one unlocks in ${days} day${days === 1 ? "" : "s"}.` }, 429);
      }
    }

    // 4 · 90-day provider protection
    const since = new Date(Date.now() - 90 * 864e5).toISOString();
    const { data: recent } = await admin.from("outreach_contacts")
      .select("provider_id").eq("passport_id", passport_id).gte("sent_at", since);
    const excluded = new Set((recent || []).map((r) => r.provider_id));

    // 5 · pick providers
    const { data: pool } = await admin.from("providers")
      .select("id,name,email,service_type").eq("service_type", service_type).eq("active", true);
    const targets = (pool || []).filter((p) => !excluded.has(p.id)).slice(0, BATCH_SIZE);
    if (!targets.length) {
      return json({ error: "no_providers", message: "No new providers for this service yet — the directory is filling. Your request is noted." }, 503);
    }

    // 6 · compose from the passport
    const d = (passport.data || {}) as Record<string, any>;
    const cp = d.childProfile || {};
    const first = cp.firstName || "our child";
    let age: number | null = null;
    if (cp.dob) { const b = new Date(cp.dob); if (!isNaN(+b)) age = Math.floor((Date.now() - +b) / 31557600000); }
    const dx = Array.isArray(d.diagnosis?.diagnoses) && d.diagnosis.diagnoses.length
      ? d.diagnosis.diagnoses.slice(0, 2).join(", ") : "";
    const parent = String(d.household?.g1name || "").replace(/\s*\([^)]*\)\s*$/, "").trim() || "A parent";
    const parentEmail = d.household?.g1email || user.email;
    const svc = SERVICE_LABEL[service_type];

    const subject = `Family seeking ${svc} — ${first}${age != null ? `, ${age} y/o` : ""} (Montréal)`;
    const bodyFor = (providerName: string) => `Hello ${providerName},

${parent} is looking for ${svc} for their ${age != null ? age + "-year-old " : ""}child, ${first}${dx ? ` (${dx})` : ""}, in the Montréal area.

They asked UniqueApex — a coordination platform for families of children with neurodevelopmental needs — to introduce them to a small number of matched providers. If you are accepting new clients (or have a waitlist they can join), simply reply to this email: it goes directly to the family at ${parentEmail}.

A one-page family profile with ${first}'s strengths, needs and history is ready to share on request.

Thank you for the work you do,
UniqueApex · uniqueapex.com
—
You received this because your practice offers ${svc} in this region. We won't contact you about this family again for at least 90 days.`;

    const RESEND = Deno.env.get("RESEND_API_KEY")!;
    const send = (to: string, subj: string, text: string, replyTo?: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "UniqueApex <contact@uniqueapex.com>", to: [to], subject: subj, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
      });

    // 7 · record the request first, then send
    const { data: reqRow, error: reqErr } = await admin.from("outreach_requests")
      .insert({ user_id: user.id, passport_id, service_type, status: "queued", sent_count: 0 })
      .select().single();
    if (reqErr || !reqRow) return json({ error: "db", message: "Couldn't record the request — run plans_outreach_setup.sql?" }, 500);

    let sent = 0;
    for (const t of targets) {
      let ok = false;
      try { ok = (await send(t.email, subject, bodyFor(t.name), parentEmail)).ok; } catch (_) { ok = false; }
      if (ok) sent++;
      await admin.from("outreach_contacts").insert({
        request_id: reqRow.id, user_id: user.id, passport_id,
        provider_id: t.id, service_type, status: ok ? "sent" : "failed",
      });
    }
    await admin.from("outreach_requests").update({
      status: sent === targets.length ? "sent" : sent > 0 ? "partial" : "failed",
      sent_count: sent,
    }).eq("id", reqRow.id);

    // confirmation to the parent
    if (sent > 0) {
      try {
        await send(parentEmail, `We introduced you to ${sent} ${svc} provider${sent === 1 ? "" : "s"} ✦`,
          `Hi ${parent},\n\nYour automated outreach for ${svc} just went out to ${sent} matched provider${sent === 1 ? "" : "s"} for ${first}. Replies will land directly in this inbox.\n\nTip: providers move fastest when you reply within a day, and the Family Passport PDF answers most intake questions.\n\n— UniqueApex`);
      } catch (_) { /* confirmation is best-effort */ }
    }

    return json({ ok: true, sent, requested: targets.length, plan });
  } catch (e) {
    return json({ error: "unexpected", message: String(e) }, 500);
  }
});
