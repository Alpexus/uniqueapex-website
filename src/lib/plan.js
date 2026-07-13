/* ============================================================
   plan.js — PLAN-V1: the tier system, in one place.
   ------------------------------------------------------------
   Three tiers. The SOURCE OF TRUTH is the `subscriptions` table
   (users can read their own row, never write it — see
   plans_outreach_setup.sql). This file reads it once per page,
   caches it, and exposes limits the UI gates on.

   ⚠ UI gates are for experience; ENFORCEMENT lives server-side:
     · children per plan  → passports INSERT policy (SQL)
     · outreach quotas    → send-outreach edge function
   So even a user editing JavaScript can't exceed their plan.

   Usage:
     import { getPlan, PLANS, upsellHTML } from "../lib/plan.js";
     const plan = await getPlan();          // "free"|"premium"|"family"
     if (!PLANS[plan].history) { …show upsellHTML(…)… }
   ============================================================ */
import { getValidSession, authHeaders } from "./ua-data.js";

const SUPABASE_URL = "https://eghqufgiudxjkbsddtnx.supabase.co";

export const PLANS = {
  free: {
    key: "free", label: "Free",
    children: 1,          /* max child profiles                     */
    vaultFiles: 5,        /* documents in the vault                 */
    history: false,       /* Growth then-vs-now + what-changed      */
    outreach: "1 automated batch per service type",
  },
  premium: {
    key: "premium", label: "Member",
    children: 1,
    vaultFiles: Infinity,
    history: true,
    outreach: "1 batch per service type every 30 days",
  },
  family: {
    key: "family", label: "Family",
    children: 4,
    vaultFiles: Infinity,
    history: true,
    outreach: "1 batch per service type every 30 days",
  },
};

let _cache = null;
/** The caller's effective plan key — cached per page load. */
export async function getPlan() {
  if (_cache) return _cache;
  try {
    const s = await getValidSession();
    if (!s) return (_cache = "free");
    const r = await fetch(
      SUPABASE_URL + "/rest/v1/subscriptions?select=plan,current_period_end&user_id=eq." + s.user.id,
      { headers: authHeaders(s.access_token) },
    );
    if (r.ok) {
      const rows = await r.json();
      const row = rows && rows[0];
      const active = row && (!row.current_period_end || new Date(row.current_period_end) > new Date());
      if (active && PLANS[row.plan]) return (_cache = row.plan);
    }
  } catch { /* table missing or offline → free */ }
  return (_cache = "free");
}

/** A consistent, warm upgrade card (returns HTML). */
export function upsellHTML(title, msg, cta = "See the plans") {
  return `<div class="up-lock cu-rev">
    <span class="up-ic"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="7" width="9" height="6.5" rx="1.6"/><path d="M5.5 7V5.4a2.5 2.5 0 015 0V7"/></svg></span>
    <span class="up-tx"><b>${title}</b><span>${msg}</span></span>
    <a class="btn btn-primary btn-sm" href="/pricing">${cta}</a>
  </div>`;
}
