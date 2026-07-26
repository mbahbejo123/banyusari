-- 1. Buat pengguna dahulu melalui Supabase Dashboard > Authentication > Users > Add user.
-- 2. Ganti alamat surel di bawah dengan surel pengguna tersebut, lalu jalankan query ini.
insert into public.admin_profiles (id, full_name, role, is_active)
select id, 'Administrator Desa', 'super_admin', true
from auth.users
where email = 'GANTI_DENGAN_EMAIL_ADMIN'
on conflict (id) do update
set full_name = excluded.full_name,
    role = excluded.role,
    is_active = excluded.is_active;
