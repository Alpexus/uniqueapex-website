# UniqueApex — Setup Checklist (do these in order)

*Everything the app needs to go from "code in the repo" to "working tiers + automated outreach". Steps marked 🖱 happen in the browser; ⌨ in your VS Code terminal.*

---

## A · Push the code ⌨

Open the terminal in VS Code (repo folder) and run:

```
git add -A
git commit -m "Copilot platform: light redesign, journey/growth/wheel, tiers + automated outreach"
git push origin main
```

- [ ] Pushed — Vercel deploys automatically (~2 min). Check uniqueapex.com still loads.
- Note: the app degrades gracefully — until you finish section B, history/outreach simply show friendly "setup pending" notes and everyone is treated as Free. Nothing breaks.

---

## B · Supabase (the database side) 🖱

Think of it as three things: a **filing cabinet** (tables), a **security guard** (rules about who can read/write), and a **robot mail clerk** (the edge function that sends outreach emails). You're installing all three.

### B1 — Run the two SQL files
1. Go to **supabase.com → your `uniqueapex` project → SQL Editor → New query**.
2. Open `snapshots_setup.sql` (repo root) in VS Code, copy ALL of it, paste, press **Run**. → creates the check-in history table (powers Growth's then-vs-now).
- [ ] snapshots_setup.sql ran without errors
3. New query again. Before pasting the second file, run this one line and note what it returns:
   ```sql
   select policyname from pg_policies where tablename = 'passports' and cmd = 'INSERT';
   ```
   - [ ] I noted the INSERT policy name(s): ______________
4. Open `plans_outreach_setup.sql`, and if your policy name from step 3 is different from the two names in the `drop policy if exists …` lines, edit those lines to match. Then paste the whole file and **Run**. → creates `subscriptions`, `providers`, `outreach_requests`, `outreach_contacts`, and the "max 1 child unless Family plan" database rule.
- [ ] plans_outreach_setup.sql ran without errors
5. Re-run the step-3 query — it should now show only **passport insert within plan limit**. If an old INSERT policy is still listed, drop it:
   `drop policy "THE-OLD-NAME" on public.passports;`
- [ ] Only the new INSERT policy remains

### B2 — Deploy the robot mail clerk (edge function)
The code is in the repo at `supabase/functions/send-outreach/index.ts`. Two ways — pick one:

**Easy way (dashboard):**
1. Supabase → **Edge Functions → Deploy a new function** (or "Create function" → via editor).
2. Name it exactly: `send-outreach`.
3. Paste the entire contents of `index.ts` into the editor → **Deploy**.

**CLI way (like a pro):** ⌨ `supabase functions deploy send-outreach` from the repo folder (needs the Supabase CLI logged in and linked once: `supabase login`, `supabase link`).

- [ ] Function `send-outreach` shows as deployed
4. Supabase → Edge Functions → **Secrets**: confirm `RESEND_API_KEY` is listed (it is, from the waitlist emails). If missing, add it from resend.com → API Keys.
- [ ] RESEND_API_KEY present

### B3 — Fill the provider address book
1. Supabase → **Table Editor → providers → Insert row**.
2. Fill: `name`, `email`, and `service_type` — use exactly one of these codes: `slp` (speech), `ot` (occupational), `aba` (behaviour), `psych` (psychologist), `social` (social groups). City defaults to Montréal.
3. **For testing: add one fake provider per service with YOUR OWN email** so batches land in your inbox.
- [ ] At least 1 test provider per service type added

### B4 — Give yourself a plan (until Stripe)
1. Supabase → **Authentication → Users** → find your account → copy its **UUID**.
2. SQL Editor:
   ```sql
   insert into public.subscriptions (user_id, plan) values ('PASTE-UUID-HERE', 'family')
     on conflict (user_id) do update set plan = excluded.plan, updated_at = now();
   ```
   Plans: `'free'` (or just delete the row), `'premium'`, `'family'`.
- [ ] Test upgrade works (site header "＋Add a child" behaves per plan)

---

## C · Test the whole loop 🖱

- [ ] As **Free** (no subscriptions row): Providers → Matches → "✦ Send intro batch" → confirm → toast says sent → email arrives (to your test provider address) with Reply-To = your parent email → confirmation email arrives to you.
- [ ] Press the same button again → "Free batch used ✓" + upgrade card. (That's the free hook working.)
- [ ] Providers → Applications: the batch appears in **Automated outreach** history.
- [ ] Growth: as Free with 2+ check-ins → history is locked with the upgrade card; set plan to `premium` → refresh → then-vs-now unlocks.
- [ ] Documents: as Free, upload a 6th file → blocked with upgrade card.
- [ ] Header ＋Add a child: Free → sent to /pricing; `family` → passport opens.

---

## D · Stripe (when you're ready to charge — not built yet)

What will happen, in order, when we build it (about one session of work):
1. You create a **Stripe account** and, inside it, two **Products**: "Member (monthly)" and "Family (monthly)" with their prices. Stripe gives you API keys.
2. I add two tiny edge functions: **checkout** (the Upgrade buttons on /pricing send people to Stripe's secure payment page — we never see card numbers) and **webhook** (Stripe calls it after every payment/renewal/cancellation, and it writes the `subscriptions` row automatically).
3. That's the whole integration — the app already reads `subscriptions`, so paying = instant unlock, cancelling = back to Free at period end. Zero other changes.
- [ ] Stripe account created (when ready) → then ask Claude for the Stripe session

---

## E · Before real families arrive

- [ ] Verify the government links in Funding (Canada.ca × 3, Retraite Québec, Québec.ca) and add org websites in Resources → Community
- [ ] /pricing page copy must match the real limits (1 child · 5 docs · 1 batch/service on Free; Family = up to 4 children)
- [ ] Change the admin dashboard password (still the default)
- [ ] Quick mobile pass on the new pages
- [ ] French strings for the app tabs (still EN-only)
