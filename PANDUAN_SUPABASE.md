# Panduan Konfigurasi Supabase

## 1. Buat proyek Supabase

1. Masuk ke dashboard Supabase.
2. Pilih **New Project**.
3. Isi nama proyek, kata sandi database, dan region terdekat.
4. Tunggu proyek aktif.

## 2. Jalankan skema database

1. Buka **SQL Editor**.
2. Pilih **New query**.
3. Buka file `supabase/schema.sql` dari proyek ini.
4. Salin seluruh isinya ke SQL Editor.
5. Klik **Run**.

Berkas tersebut membuat seluruh tabel, RLS, bucket gambar, dan kebijakan akses.

## 3. Buat akun admin pertama

1. Buka **Authentication > Users**.
2. Klik **Add user**.
3. Masukkan surel dan kata sandi admin.
4. Aktifkan konfirmasi surel saat membuat pengguna apabila opsinya tersedia.
5. Buka `supabase/create-first-admin.sql`.
6. Ganti `GANTI_DENGAN_EMAIL_ADMIN` dengan surel yang baru dibuat.
7. Jalankan query melalui SQL Editor.

Tanpa langkah keenam dan ketujuh, pengguna dapat login ke Supabase tetapi tidak memperoleh akses dashboard CMS.

## 4. Ambil URL dan Publishable Key

1. Pada dashboard proyek, klik **Connect**.
2. Pilih konfigurasi Next.js.
3. Salin **Project URL**.
4. Salin **Publishable key**.

Jangan memasukkan `service_role` key ke proyek frontend.

## 5. Buat `.env.local`

Salin `.env.example` menjadi `.env.local`, kemudian isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxx
```

## 6. Jalankan website

Pada PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Buka:

```text
http://localhost:3000
```

Login admin:

```text
http://localhost:3000/admin/login
```

## 7. Urutan pengisian admin

1. Profil Desa
2. Enam Dusun
3. Data Penduduk
4. Perangkat Desa
5. Potensi Desa
6. Infrastruktur
7. BUMDes dan Usaha
8. Kelembagaan
9. Pelayanan
10. Perumahan
11. Berita
12. Galeri

## 8. Menambah admin lain

1. Buat pengguna baru melalui Authentication > Users.
2. Jalankan query berikut dengan surel yang sesuai:

```sql
insert into public.admin_profiles (id, full_name, role, is_active)
select id, 'Nama Admin', 'admin', true
from auth.users
where email = 'admin@desa.id';
```

Role yang tersedia adalah `super_admin`, `admin`, dan `editor`. Pada versi proyek ini seluruh role aktif dapat mengelola konten. Pembatasan hak per role dapat dikembangkan kemudian.

## 9. Catatan data sensitif

Simpan statistik penduduk dalam bentuk agregat. Jangan memasukkan NIK, nama penduduk, tanggal lahir, alamat rinci, atau data pribadi lainnya ke tabel statistik publik. Foto rumah tidak layak huni dan titik lokasi rumah sebaiknya hanya dipublikasikan setelah memperoleh persetujuan dan mempertimbangkan perlindungan keluarga yang bersangkutan.
