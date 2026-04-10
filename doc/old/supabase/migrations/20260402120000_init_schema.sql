-- niconico-event-schedule: initial schema, RLS, storage bucket
-- Apply via Supabase Dashboard → SQL Editor, or: supabase db push (CLI)

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Private admin config (email not exposed to clients; no direct SELECT for anon)
-- -----------------------------------------------------------------------------
create schema if not exists private;

create table private.admin_config (
  id smallint primary key default 1,
  admin_email text not null,
  constraint admin_config_singleton check (id = 1)
);

comment on table private.admin_config is 'Single row. Set admin_email after first deploy (or edit before apply).';

insert into private.admin_config (id, admin_email)
values (1, 'CHANGE_ME@example.com')
on conflict (id) do nothing;

revoke all on schema private from public;
revoke all on table private.admin_config from public;

-- -----------------------------------------------------------------------------
-- Posts (inserts from app: service_role only, bypasses RLS)
-- -----------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  start_date date not null,
  end_date date not null,
  announcement_url text not null,
  thumbnail_path text not null,
  author_display_name text not null,
  author_x_handle text not null,
  category text not null default 'vehicle',
  created_at timestamptz not null default now(),
  constraint posts_date_order check (end_date >= start_date)
);

comment on table public.posts is 'Event (投稿祭) submissions. category default vehicle = 車載動画寄り';
comment on column public.posts.thumbnail_path is 'Path in bucket event-thumbnails (no leading bucket name)';
comment on column public.posts.author_x_handle is 'X/Twitter handle as entered by submitter';

create index posts_list_active_idx on public.posts (end_date, start_date desc);
create index posts_start_date_idx on public.posts (start_date desc);

alter table public.posts enable row level security;

-- SECURITY DEFINER: can read private.admin_config while evaluating RLS
create or replace function public.is_event_admin()
returns boolean
language sql
security definer
set search_path = public, private
stable
as $$
  select exists (
    select 1 from private.admin_config c
    where lower(c.admin_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_event_admin() from public;
grant execute on function public.is_event_admin() to authenticated;

create policy "Anyone can read posts"
on public.posts
for select
to anon, authenticated
using (true);

-- anonymous user: no INSERT / UPDATE policies → cannot write via anon key
-- inserts are done with service_role from Next.js Route Handler (bypasses RLS)

create policy "Admin can delete posts"
on public.posts
for delete
to authenticated
using (public.is_event_admin());

-- -----------------------------------------------------------------------------
-- Storage: public thumbnails
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-thumbnails',
  'event-thumbnails',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read event thumbnails"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'event-thumbnails');

-- Uploads: no anon/authenticated INSERT policy → only service_role (server) uploads
