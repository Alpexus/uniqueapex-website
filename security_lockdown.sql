-- ============================================================
-- SECURITY LOCKDOWN — run once in the Supabase SQL Editor.
--
-- WHY: the waitlist table's read/update policies were `true`,
-- meaning ANYONE holding the public anon key (it's in the site's
-- source, by design) could download every family's name, email,
-- phone and child diagnosis, or overwrite statuses.
--
-- AFTER THIS: only YOUR logged-in account can read/update the
-- waitlist. The admin console already sends your login token, so
-- it keeps working — just be logged into the app in the same
-- browser when you use it.
--
-- >>> STEP 1 (IMPORTANT): replace PUT-YOUR-LOGIN-EMAIL-HERE below
--     (both places) with the email you use to log in to the app.
-- >>> STEP 2: press Run.
-- ============================================================

drop policy if exists "Allow admin to read" on public.waitlist;
drop policy if exists "Allow admin to update" on public.waitlist;
-- (these two make the script safe to run more than once)
drop policy if exists "Coordinator can read waitlist" on public.waitlist;
drop policy if exists "Coordinator can update waitlist" on public.waitlist;

create policy "Coordinator can read waitlist"
  on public.waitlist
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'PUT-YOUR-LOGIN-EMAIL-HERE');

create policy "Coordinator can update waitlist"
  on public.waitlist
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'PUT-YOUR-LOGIN-EMAIL-HERE')
  with check ((auth.jwt() ->> 'email') = 'PUT-YOUR-LOGIN-EMAIL-HERE');

-- The public INSERT policy stays untouched — the waitlist form
-- still needs to create rows.

-- STEP 3: verify — you should see the insert policy plus the two
-- new "Coordinator" policies:
select policyname, cmd from pg_policies where tablename = 'waitlist';
