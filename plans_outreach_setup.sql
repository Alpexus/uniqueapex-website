-- ============================================================
-- plans_outreach_setup.sql — TIERS + AUTOMATED OUTREACH
-- Run once in Supabase SQL Editor. Three parts:
--   1) subscriptions  — the single source of truth for plans
--                       (free / premium / family). Users can READ
--                       their own row, never write it — only you
--                       (SQL editor / service role / future Stripe
--                       webhook) can set plans. This is what makes
--                       the gating tamper-proof.
--   2) passports limit — INSERT policy enforcing 1 child unless
--                       plan = family (then 4). SERVER-side, so the
--                       UI gate can't be bypassed.
--   3) outreach        — providers directory + outreach_requests +
--                       outreach_contacts (the 90-day protection
--                       rule reads this). Written ONLY by the
--                       send-outreach edge function.
-- ============================================================

-- ---------- 1) SUBSCRIPTIONS ----------
create table if not exists public.subscriptions (
  user_id            uuid primary key references auth.users (id) on delete cascade,
  plan               text not null default 'free' check (plan in ('free','premium','family')),
  current_period_end timestamptz,            -- null = no expiry (manual grants)
  updated_at         timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "own subscription select" on public.subscriptions
  for select using (auth.uid() = user_id);
-- NO insert/update/delete policies: only the service role (edge
-- functions, SQL editor, Stripe webhook later) can write plans.

-- Helper: the caller's effective plan ('free' when no active row).
create or replace function public.effective_plan()
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    (select plan from public.subscriptions
      where user_id = auth.uid()
        and (current_period_end is null or current_period_end > now())),
    'free');
$$;

-- ---------- 2) PASSPORT LIMIT (children per plan) ----------
-- IMPORTANT: policies are OR'd. If an old INSERT policy exists on
-- passports it must be dropped or the limit won't bite.
-- Check what exists:   select policyname from pg_policies
--                      where tablename = 'passports';
drop policy if exists "own passports insert" on public.passports;
drop policy if exists "Allow individual insert" on public.passports;
drop policy if exists "Owner can insert own passports" on public.passports;  -- ← the one in Pelin's project

create policy "passport insert within plan limit" on public.passports
  for insert with check (
    auth.uid() = user_id
    and (select count(*) from public.passports p where p.user_id = auth.uid())
        < case public.effective_plan() when 'family' then 4 else 1 end
  );

-- ---------- 3) OUTREACH ----------
-- The provider directory. You (admin) fill this — start with the
-- providers you already know in Montréal.
create table if not exists public.providers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  service_type text not null check (service_type in ('slp','ot','aba','psych','social')),
  email        text not null,
  phone        text,
  city         text default 'Montréal',
  languages    text default 'EN/FR',
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
alter table public.providers enable row level security;
create policy "providers readable by signed-in" on public.providers
  for select using (auth.role() = 'authenticated' and active = true);
-- No user writes — admin only.

-- One row per batch a family requests.
create table if not exists public.outreach_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  passport_id  uuid not null references public.passports (id) on delete cascade,
  service_type text not null check (service_type in ('slp','ot','aba','psych','social')),
  status       text not null default 'sent' check (status in ('queued','sent','partial','failed')),
  sent_count   integer not null default 0,
  created_at   timestamptz not null default now()
);
alter table public.outreach_requests enable row level security;
create policy "own outreach requests select" on public.outreach_requests
  for select using (auth.uid() = user_id);
-- Inserts happen only via the send-outreach edge function (service role).

-- One row per provider actually emailed — powers the 90-day rule.
create table if not exists public.outreach_contacts (
  id           uuid primary key default gen_random_uuid(),
  request_id   uuid not null references public.outreach_requests (id) on delete cascade,
  user_id      uuid not null,
  passport_id  uuid not null,
  provider_id  uuid not null references public.providers (id) on delete cascade,
  service_type text not null,
  sent_at      timestamptz not null default now(),
  status       text not null default 'sent' check (status in ('sent','failed'))
);
alter table public.outreach_contacts enable row level security;
create policy "own outreach contacts select" on public.outreach_contacts
  for select using (auth.uid() = user_id);

create index if not exists outreach_contacts_guard_idx
  on public.outreach_contacts (passport_id, provider_id, sent_at);
create index if not exists outreach_requests_quota_idx
  on public.outreach_requests (passport_id, service_type, created_at);

-- ---------- sample data (edit freely, then uncomment) ----------
-- insert into public.providers (name, service_type, email, city) values
--   ('Clinique Orthophonie Exemple', 'slp',   'intake@example-slp.ca',  'Montréal'),
--   ('Ergo Enfance Exemple',         'ot',    'info@example-ot.ca',     'Montréal'),
--   ('Comportement Plus Exemple',    'aba',   'admin@example-aba.ca',   'Montréal');

-- ---------- upgrading someone manually (until Stripe) ----------
-- insert into public.subscriptions (user_id, plan) values ('<USER-UUID>', 'family')
--   on conflict (user_id) do update set plan = excluded.plan, updated_at = now();
