-- ============================================================
-- PROVIDER PORTAL — future database blueprint.
-- ⚠️ DO NOT RUN YET. This activates when clinic onboarding starts.
-- The /pro pages currently run in preview mode with sample data;
-- each page has a TODO-LIVE comment showing what plugs in here.
-- ============================================================

-- 1 · Link a login to a clinic (one clinic can have several staff logins)
create table if not exists public.provider_accounts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  display_name text,
  role text not null default 'owner',          -- owner | staff
  created_at timestamptz not null default now()
);
alter table public.provider_accounts enable row level security;
create policy "Provider reads own link" on public.provider_accounts
  for select to authenticated using (auth.uid() = user_id);
-- (rows are created by the service role during onboarding, not by clients)

-- 2 · Public-profile fields the provider edits in /pro/profile —
--     including the FUTURE MATCHING FACTORS (accepting / waitlist / booking)
alter table public.providers
  add column if not exists bio text,
  add column if not exists fees text,
  add column if not exists accepting_new boolean not null default true,
  add column if not exists waitlist_weeks int not null default 0,
  add column if not exists booking_enabled boolean not null default false,
  add column if not exists profile_updated_at timestamptz;
create policy "Provider updates own clinic" on public.providers
  for update to authenticated
  using (id in (select provider_id from public.provider_accounts where user_id = auth.uid()))
  with check (id in (select provider_id from public.provider_accounts where user_id = auth.uid()));

-- 3 · Weekly availability template (drives /pro/schedule and, later,
--     the open slots families can book from the family portal)
create table if not exists public.provider_availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  slot time not null,
  state text not null default 'open' check (state in ('open','blocked')),
  unique (provider_id, weekday, slot)
);
alter table public.provider_availability enable row level security;
create policy "Availability readable by signed-in" on public.provider_availability
  for select to authenticated using (true);
create policy "Provider manages own availability" on public.provider_availability
  for all to authenticated
  using (provider_id in (select provider_id from public.provider_accounts where user_id = auth.uid()))
  with check (provider_id in (select provider_id from public.provider_accounts where user_id = auth.uid()));

-- 4 · Bookings (family requests a slot → provider accepts/declines)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  passport_id uuid not null references public.passports (id) on delete cascade,
  family_user_id uuid not null references auth.users (id) on delete cascade,
  starts_at timestamptz not null,
  duration_min int not null default 45,
  status text not null default 'requested'
    check (status in ('requested','confirmed','declined','cancelled','done')),
  note text,
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy "Family sees own bookings" on public.bookings
  for select to authenticated using (auth.uid() = family_user_id);
create policy "Family requests bookings" on public.bookings
  for insert to authenticated with check (auth.uid() = family_user_id and status = 'requested');
create policy "Provider sees own bookings" on public.bookings
  for select to authenticated
  using (provider_id in (select provider_id from public.provider_accounts where user_id = auth.uid()));
create policy "Provider updates own bookings" on public.bookings
  for update to authenticated
  using (provider_id in (select provider_id from public.provider_accounts where user_id = auth.uid()));

-- 5 · Document shares (two-way; files live in Storage, this is the grant log)
create table if not exists public.provider_shares (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  passport_id uuid not null references public.passports (id) on delete cascade,
  family_user_id uuid not null references auth.users (id) on delete cascade,
  direction text not null check (direction in ('to_provider','to_family')),
  title text not null,
  storage_path text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);
alter table public.provider_shares enable row level security;
create policy "Family sees own shares" on public.provider_shares
  for select to authenticated using (auth.uid() = family_user_id);
create policy "Family creates shares to provider" on public.provider_shares
  for insert to authenticated with check (auth.uid() = family_user_id and direction = 'to_provider');
create policy "Family revokes own shares" on public.provider_shares
  for update to authenticated using (auth.uid() = family_user_id);
create policy "Provider sees own shares" on public.provider_shares
  for select to authenticated
  using (provider_id in (select provider_id from public.provider_accounts where user_id = auth.uid()) and revoked_at is null);
create policy "Provider shares to family" on public.provider_shares
  for insert to authenticated
  with check (direction = 'to_family'
    and provider_id in (select provider_id from public.provider_accounts where user_id = auth.uid()));

-- 6 · Questions (async Q&A between sessions)
create table if not exists public.provider_questions (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  passport_id uuid not null references public.passports (id) on delete cascade,
  family_user_id uuid not null references auth.users (id) on delete cascade,
  question text not null,
  answer text,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.provider_questions enable row level security;
create policy "Family sees own questions" on public.provider_questions
  for select to authenticated using (auth.uid() = family_user_id);
create policy "Family asks questions" on public.provider_questions
  for insert to authenticated with check (auth.uid() = family_user_id);
create policy "Provider sees own questions" on public.provider_questions
  for select to authenticated
  using (provider_id in (select provider_id from public.provider_accounts where user_id = auth.uid()));
create policy "Provider answers own questions" on public.provider_questions
  for update to authenticated
  using (provider_id in (select provider_id from public.provider_accounts where user_id = auth.uid()));

-- 7 · Matching upgrade (when this goes live): candidatesFor() on the
--     matches page starts sorting by accepting_new, waitlist_weeks and
--     availability density on top of distance — the columns above are
--     exactly that data.
