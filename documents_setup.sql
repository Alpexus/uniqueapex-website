-- ============================================================
-- documents_setup.sql — one-time setup for the Document Vault
-- ------------------------------------------------------------
-- HOW TO RUN (3 steps, ~3 minutes):
--
-- STEP 1 — Create the storage bucket:
--   Supabase dashboard → Storage → New bucket
--   · Name: documents
--   · Public bucket: OFF (keep it private)
--   → Save
--
-- STEP 2 — Run this whole file:
--   Supabase dashboard → SQL Editor → New query
--   → paste everything below → Run
--
-- STEP 3 — Test:
--   Refresh uniqueapex.com/documents (or localhost) and upload
--   any PDF. It should appear in the list with a Download link.
-- ============================================================

-- ---------- the documents table ----------
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid not null references auth.users (id),
  passport_id uuid,
  file_name text,
  file_type text,
  storage_path text,
  category text default 'Other'
);

alter table documents enable row level security;

-- each family sees and manages ONLY their own documents
drop policy if exists "own docs select" on documents;
create policy "own docs select" on documents
  for select using (auth.uid() = user_id);

drop policy if exists "own docs insert" on documents;
create policy "own docs insert" on documents
  for insert with check (auth.uid() = user_id);

drop policy if exists "own docs delete" on documents;
create policy "own docs delete" on documents
  for delete using (auth.uid() = user_id);

-- ---------- storage policies (files live under {user_id}/...) ----------
drop policy if exists "own files read" on storage.objects;
create policy "own files read" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "own files write" on storage.objects;
create policy "own files write" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "own files delete" on storage.objects;
create policy "own files delete" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
