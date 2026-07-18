# UniqueApex — Security Review
*July 17, 2026 · full pass over the website repo, database policies (as known), and public forms.*

## Verdict
Two real problems found. Both are addressed in this commit — **one needs you to run one SQL file** to complete. Everything else is either already solid or a lower-priority hardening item listed at the bottom.

---

## 🔴 CRITICAL — Waitlist table was readable by anyone (ACTION NEEDED)
**What:** the `waitlist` table's read and update policies were `true` — open to anyone. The anon key is public by design (it ships in the website's source), so anyone who looked at the site's code could have downloaded every family's name, email, phone and child's diagnosis, or changed statuses. The old admin page depended on this openness.

**Fix (done in code):** the Coordinator Console now authenticates waitlist reads and status updates with **your login token**, not the bare public key.

**Fix (you — 2 minutes):** open `security_lockdown.sql` (repo root), replace `PUT-YOUR-LOGIN-EMAIL-HERE` (two places) with the email you log into the app with, and run it in the Supabase SQL Editor. From then on only your account can read/update the waitlist. The console keeps working — just be logged into the app in the same browser.

**Note:** there is no indication anyone actually accessed the data — this closes the door.

## 🟠 HIGH — Old signup page was still live (FIXED)
`src/pages/signup_full_BACKUP.astro` was routed at `/signup_full_BACKUP` and ran the OLD signup flow — creating accounts and passports without the Turnstile-verified edge function. Unlinked, but discoverable. Now neutralized (redirects to `/signup`, noindex). Rule going forward: never keep backup files inside `src/pages` — everything there becomes a live URL. The reference copy at the repo root is fine (not routed).

## 🟡 Fixed earlier this sprint
- **Stored XSS in the admin dashboard** — family-submitted text was injected into the page unescaped; one malicious "name" on the public form could have run code in your browser. All admin rendering now HTML-escapes every field.
- **Provider directory reads** — RLS-protected (signed-in users only); admin console refreshes tokens properly.

## 🟢 Checked and sound
- **No server secrets in the repo** — searched for service-role keys, Resend keys: none. The Supabase anon key in pages is public **by design** and safe *only because* RLS is right — which is why the waitlist fix above matters.
- **Row-level security by default** — passports, snapshots, documents, subscriptions, outreach tables: owner-only read; plans/quotas enforced server-side in the edge function; `subscriptions` has no client write path at all.
- **`send-outreach` edge function** — verifies the JWT, checks passport ownership, validates every hand-picked provider id server-side, enforces quotas + 90-day protection, caps batch size, sanitizes the custom message length. Solid.
- **Public forms** — waitlist (EN + FR) and signup all post to edge functions with Cloudflare Turnstile, honeypot and timing checks; no direct database writes from public pages anymore.
- **Contact form** — Web3Forms with a public access key: worst case is spam to your inbox, no data exposure.
- **Payment data** — none stored (Stripe not yet integrated).

## 🔵 Hardening added in this commit
- **Security headers** (`vercel.json`): nosniff, frame protection, strict referrer policy, HSTS, camera/mic/location disabled.
- **`/admin` noindex** — search engines are told to stay away from the console (and the old backup page).
- **Consent + accurate promises** — the "we never share your information" lines were replaced with accurate Privacy-Policy references on both waitlist forms; the French form now has the consent checkbox too.

## ⚪ Remaining items (lower priority, in order)
1. **Run `security_lockdown.sql`** ← the one action from this review.
2. **Rotate the admin console password** — it sits in the client code and in git history. After the SQL fix it only gates cosmetics (data needs your login), but rotate it anyway; long-term, replace the gate with a real admin role check.
3. **Verify in the Supabase dashboard** (5 minutes): the `signup-submit` and `waitlist-submit` edge functions verify the Turnstile token **server-side with the secret key** (their code lives only in Supabase, not this repo, so I couldn't audit them); and Storage → `vault` bucket policies are owner-only.
4. **Move keys to environment variables** (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`) — hygiene, not urgent.
5. **When the Google Maps key is added** — restrict it to your domains + Maps JavaScript API only (the setup guide covers this).
6. **Later, with revenue:** professional penetration test + the legal review, together.
