-- ============================================================
-- snapshots_setup.sql — passport check-in history (GROWTH tab)
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Powers "then vs now", the what-changed feed, and wheel trends.
-- The app degrades gracefully until this exists (history simply
-- starts on the first visit after you run it).
-- ============================================================

-- 1) The table: one row per passport check-in (saved automatically
--    by the app whenever it notices the passport changed).
create table if not exists public.passport_snapshots (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users (id) on delete cascade,
  passport_id          uuid not null references public.passports (id) on delete cascade,
  taken_at             timestamptz not null default now(),
  passport_updated_at  timestamptz,
  data                 jsonb not null default '{}'::jsonb,
  wheel                jsonb not null default '{}'::jsonb
);

-- 2) Row-level security: families only ever see their own history.
alter table public.passport_snapshots enable row level security;

create policy "own snapshots select" on public.passport_snapshots
  for select using (auth.uid() = user_id);

create policy "own snapshots insert" on public.passport_snapshots
  for insert with check (auth.uid() = user_id);

create policy "own snapshots delete" on public.passport_snapshots
  for delete using (auth.uid() = user_id);

-- 3) Fast lookups per child, in time order.
create index if not exists passport_snapshots_pid_idx
  on public.passport_snapshots (passport_id, taken_at);
