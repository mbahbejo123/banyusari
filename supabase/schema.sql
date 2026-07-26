-- Jalankan seluruh berkas ini melalui Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('super_admin','admin','editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  village_name text,
  district text,
  regency text,
  province text,
  postal_code text,
  address text,
  phone text,
  email text,
  village_head_name text,
  welcome_message text,
  history text,
  vision text,
  mission text,
  logo_url text,
  hero_image_url text,
  office_maps_url text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.site_settings(id) values (1) on conflict (id) do nothing;

create table if not exists public.hamlets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  head_name text,
  description text,
  population_total integer check (population_total is null or population_total >= 0),
  area_size numeric(14,2) check (area_size is null or area_size >= 0),
  image_url text,
  maps_url text,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.population_statistics (
  id uuid primary key default gen_random_uuid(),
  hamlet_id uuid references public.hamlets(id) on delete cascade,
  statistic_type text not null check (statistic_type in ('gender','education','marital_status','age')),
  category text not null,
  total integer not null default 0 check (total >= 0),
  period_year integer not null check (period_year between 1900 and 2200),
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.officials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  photo_url text,
  biography text,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('potential','infrastructure','business','institution','service','housing')),
  category text not null,
  title text not null,
  slug text not null,
  summary text,
  description text,
  location_name text,
  maps_url text,
  cover_image_url text,
  hamlet_id uuid references public.hamlets(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(section, slug)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  post_type text not null default 'Berita',
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  image_url text not null,
  event_date date,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();
drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
drop trigger if exists set_hamlets_updated_at on public.hamlets;
create trigger set_hamlets_updated_at before update on public.hamlets for each row execute function public.set_updated_at();
drop trigger if exists set_population_statistics_updated_at on public.population_statistics;
create trigger set_population_statistics_updated_at before update on public.population_statistics for each row execute function public.set_updated_at();
drop trigger if exists set_officials_updated_at on public.officials;
create trigger set_officials_updated_at before update on public.officials for each row execute function public.set_updated_at();
drop trigger if exists set_content_items_updated_at on public.content_items;
create trigger set_content_items_updated_at before update on public.content_items for each row execute function public.set_updated_at();
drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at before update on public.posts for each row execute function public.set_updated_at();
drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
create trigger set_gallery_items_updated_at before update on public.gallery_items for each row execute function public.set_updated_at();

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and is_active = true
  );
$$;
revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to anon, authenticated;

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.hamlets enable row level security;
alter table public.population_statistics enable row level security;
alter table public.officials enable row level security;
alter table public.content_items enable row level security;
alter table public.posts enable row level security;
alter table public.gallery_items enable row level security;

-- Profil admin hanya dapat dibaca oleh pemilik akun atau admin aktif.
drop policy if exists "admin_profiles_select" on public.admin_profiles;
create policy "admin_profiles_select" on public.admin_profiles for select to authenticated using (id = (select auth.uid()) or public.is_active_admin());
drop policy if exists "admin_profiles_manage" on public.admin_profiles;
create policy "admin_profiles_manage" on public.admin_profiles for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

-- Fungsi pembantu untuk kebijakan tabel konten dibuat satu per satu.
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings for select to anon, authenticated using (is_published = true);
drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all" on public.site_settings for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "hamlets_public_read" on public.hamlets;
create policy "hamlets_public_read" on public.hamlets for select to anon, authenticated using (is_published = true);
drop policy if exists "hamlets_admin_all" on public.hamlets;
create policy "hamlets_admin_all" on public.hamlets for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "population_public_read" on public.population_statistics;
create policy "population_public_read" on public.population_statistics for select to anon, authenticated using (is_published = true);
drop policy if exists "population_admin_all" on public.population_statistics;
create policy "population_admin_all" on public.population_statistics for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "officials_public_read" on public.officials;
create policy "officials_public_read" on public.officials for select to anon, authenticated using (is_published = true);
drop policy if exists "officials_admin_all" on public.officials;
create policy "officials_admin_all" on public.officials for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "content_public_read" on public.content_items;
create policy "content_public_read" on public.content_items for select to anon, authenticated using (is_published = true);
drop policy if exists "content_admin_all" on public.content_items;
create policy "content_admin_all" on public.content_items for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts for select to anon, authenticated using (status = 'published');
drop policy if exists "posts_admin_all" on public.posts;
create policy "posts_admin_all" on public.posts for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "gallery_public_read" on public.gallery_items;
create policy "gallery_public_read" on public.gallery_items for select to anon, authenticated using (is_published = true);
drop policy if exists "gallery_admin_all" on public.gallery_items;
create policy "gallery_admin_all" on public.gallery_items for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

-- Bucket publik untuk gambar website, maksimal 2 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('village-media', 'village-media', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "village_media_admin_insert" on storage.objects;
create policy "village_media_admin_insert" on storage.objects for insert to authenticated with check (bucket_id = 'village-media' and public.is_active_admin());
drop policy if exists "village_media_admin_update" on storage.objects;
create policy "village_media_admin_update" on storage.objects for update to authenticated using (bucket_id = 'village-media' and public.is_active_admin()) with check (bucket_id = 'village-media' and public.is_active_admin());
drop policy if exists "village_media_admin_delete" on storage.objects;
create policy "village_media_admin_delete" on storage.objects for delete to authenticated using (bucket_id = 'village-media' and public.is_active_admin());

grant select on public.site_settings, public.hamlets, public.population_statistics, public.officials, public.content_items, public.posts, public.gallery_items to anon;
grant select, insert, update, delete on public.site_settings, public.hamlets, public.population_statistics, public.officials, public.content_items, public.posts, public.gallery_items, public.admin_profiles to authenticated;
