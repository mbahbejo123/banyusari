# Profil Desa CMS Next.js + Supabase

Website profil desa dinamis yang seluruh kontennya dapat dikelola admin tanpa membuka kode.

## Fitur

- Login admin berbasis Supabase Auth
- Profil desa, sejarah, visi, misi, kontak, gambar utama, dan Google Maps
- Data enam dusun, foto, kepala dusun, luas, penduduk, dan Maps
- Statistik penduduk menurut jenis kelamin, pendidikan, dan status perkawinan
- Perangkat desa
- Potensi desa dengan halaman detail, foto, dan Maps
- Infrastruktur dengan halaman detail, foto, kondisi, ukuran, dan Maps
- BUMDes, UMKM, koperasi, dan usaha binaan PKK
- PKK, BPD, Karang Taruna, LPM, kelompok tani, dan kelembagaan lain
- Posyandu serta pelayanan masyarakat
- Rumah tidak layak huni, kondisi rumah, sanitasi, dan air bersih
- Berita, pengumuman, agenda, status draf, terbit, dan arsip
- Galeri
- Row Level Security dan bucket gambar publik

## Menjalankan

1. Ikuti `PANDUAN_SUPABASE.md`.
2. Buat `.env.local`.
3. Jalankan:

```powershell
npm.cmd install
npm.cmd run dev
```

4. Buka `http://localhost:3000`.
5. Buka `http://localhost:3000/admin/login` untuk dashboard.

## Catatan

Semua halaman mendukung kondisi database kosong. Website tidak menampilkan data fiktif apabila admin belum memublikasikan data.

## Impor Excel

Proyek ini menyediakan impor massal melalui `/admin/impor`. Template tersedia di `public/templates/template-import-data-desa.xlsx`. Fitur ini memakai `exceljs` untuk membaca berkas `.xlsx`, melakukan validasi, kemudian memasukkan atau memperbarui data melalui Supabase dengan sesi admin aktif.
