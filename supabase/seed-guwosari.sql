-- Data Contoh Guwosari
-- Jalankan setelah schema.sql jika ingin mengisi data awal
-- Hapus baris WHERE jika ingin menjalankan ulang (gunakan id tetap agar idempoten)

-- ============================================================
-- PROFIL DESA
-- ============================================================
insert into public.site_settings (id, village_name, district, regency, province, postal_code, address, phone, email, village_head_name, welcome_message, history, vision, mission, is_published)
values (
  1,
  'Banyusari',
  'Tegalrejo',
  'Gunungkidul',
  'Daerah Istimewa Yogyakarta',
  '55861',
  'Jl. Desa Banyusari No. 1, Tegalrejo, Gunungkidul',
  '(0274) 1234567',
  'desabanyusari@gmail.com',
  'Slamet Riyadi',
  'Selamat datang di Portal Desa Banyusari. Mari bersama membangun desa yang maju, mandiri, dan sejahtera.',
  'Desa Banyusari berdiri sejak tahun 1920. Awalnya merupakan kawasan pertanian dan perkebunan yang dikelola oleh masyarakat setempat. Seiring perkembangan zaman, Banyusari bertransformasi menjadi desa yang terus berbenah dalam pelayanan publik dan pembangunan infrastruktur.',
  'Terwujudnya Desa Banyusari yang maju, mandiri, dan sejahtera berdasarkan gotong royong.',
  '1. Meningkatkan kualitas pelayanan publik
2. Mengembangkan potensi sumber daya alam dan manusia
3. Membangun infrastruktur yang merata dan berkelanjutan
4. Memberdayakan UMKM dan kelembagaan desa
5. Meningkatkan kesejahteraan masyarakat melalui program-program strategis'
)
on conflict (id) do nothing;

-- ============================================================
-- DUSUN
-- ============================================================
insert into public.hamlets (id, name, slug, head_name, description, population_total, area_size, maps_url, display_order, is_published) values
  ('a0000001-0000-0000-0000-000000000001', 'Dusun Krajan', 'dusun-krajan', 'Sukirman', 'Dusun pusat pemerintahan desa Banyusari.', 1250, 85.50, 'https://maps.google.com/?q=-7.5000,110.5000', 1, true),
  ('a0000001-0000-0000-0000-000000000002', 'Dusun Ngasem', 'dusun-ngasem', 'Supardi', 'Dusun dengan potensi persawahan dan peternakan.', 980, 72.30, 'https://maps.google.com/?q=-7.5100,110.5100', 2, true),
  ('a0000001-0000-0000-0000-000000000003', 'Dusun Pucung', 'dusun-pucung', 'Karsono', 'Dusun yang dikenal dengan mata air dan perkebunan.', 870, 64.00, 'https://maps.google.com/?q=-7.5200,110.5200', 3, true),
  ('a0000001-0000-0000-0000-000000000004', 'Dusun Gading', 'dusun-gading', 'Wagiman', 'Dusun di bagian timur dengan area persawahan luas.', 760, 55.20, 'https://maps.google.com/?q=-7.5300,110.5300', 4, true),
  ('a0000001-0000-0000-0000-000000000005', 'Dusun Nglarang', 'dusun-nglarang', 'Paimin', 'Dusun dengan potensi wisata alam.', 650, 48.00, 'https://maps.google.com/?q=-7.5400,110.5400', 5, true)
on conflict (id) do nothing;

-- ============================================================
-- PERANGKAT DESA
-- ============================================================
insert into public.officials (id, name, position, biography, display_order, is_published) values
  ('b0000001-0000-0000-0000-000000000001', 'Slamet Riyadi', 'Kepala Desa', 'Kepala Desa Banyusari periode 2023-2029.', 1, true),
  ('b0000001-0000-0000-0000-000000000002', 'Siti Nurhayati', 'Sekretaris Desa', 'Sekretaris Desa yang bertanggung jawab atas administrasi desa.', 2, true),
  ('b0000001-0000-0000-0000-000000000003', 'Agus Supriyanto', 'Kaur Keuangan', 'Bendahara desa yang mengelola keuangan desa.', 3, true),
  ('b0000001-0000-0000-0000-000000000004', 'Sumarni', 'Kaur Perencanaan', 'Bertanggung jawab atas perencanaan pembangunan desa.', 4, true),
  ('b0000001-0000-0000-0000-000000000005', 'Teguh Santoso', 'Kasi Pelayanan', 'Melayani administrasi kependudukan dan perizinan.', 5, true)
on conflict (id) do nothing;

-- ============================================================
-- DATA PENDUDUK (dengan klasifikasi umur)
-- ============================================================
insert into public.population_statistics (id, hamlet_id, statistic_type, category, total, period_year, display_order, is_published) values
  -- GENDER (Seluruh Desa)
  ('c0000001-0000-0000-0000-000000000001', null, 'gender', 'Laki-laki', 2300, 2025, 1, true),
  ('c0000001-0000-0000-0000-000000000002', null, 'gender', 'Perempuan', 2210, 2025, 2, true),
  -- GENDER (per dusun)
  ('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'gender', 'Laki-laki', 640, 2025, 1, true),
  ('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'gender', 'Perempuan', 610, 2025, 2, true),
  ('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002', 'gender', 'Laki-laki', 500, 2025, 1, true),
  ('c0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000002', 'gender', 'Perempuan', 480, 2025, 2, true),
  ('c0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000003', 'gender', 'Laki-laki', 450, 2025, 1, true),
  ('c0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000003', 'gender', 'Perempuan', 420, 2025, 2, true),
  -- KLASIFIKASI UMUR
  ('c0000001-0000-0000-0000-000000000009', null, 'age', '0-5 Tahun', 350, 2025, 1, true),
  ('c0000001-0000-0000-0000-000000000010', null, 'age', '6-12 Tahun', 420, 2025, 2, true),
  ('c0000001-0000-0000-0000-000000000011', null, 'age', '13-17 Tahun', 380, 2025, 3, true),
  ('c0000001-0000-0000-0000-000000000012', null, 'age', '18-25 Tahun', 650, 2025, 4, true),
  ('c0000001-0000-0000-0000-000000000013', null, 'age', '26-35 Tahun', 720, 2025, 5, true),
  ('c0000001-0000-0000-0000-000000000014', null, 'age', '36-45 Tahun', 680, 2025, 6, true),
  ('c0000001-0000-0000-0000-000000000015', null, 'age', '46-55 Tahun', 540, 2025, 7, true),
  ('c0000001-0000-0000-0000-000000000016', null, 'age', '56-65 Tahun', 380, 2025, 8, true),
  ('c0000001-0000-0000-0000-000000000017', null, 'age', '65+ Tahun', 390, 2025, 9, true),
  -- PENDIDIKAN
  ('c0000001-0000-0000-0000-000000000018', null, 'education', 'Tidak atau Belum Sekolah', 310, 2025, 1, true),
  ('c0000001-0000-0000-0000-000000000019', null, 'education', 'Belum Tamat SD', 450, 2025, 2, true),
  ('c0000001-0000-0000-0000-000000000020', null, 'education', 'SD atau Sederajat', 980, 2025, 3, true),
  ('c0000001-0000-0000-0000-000000000021', null, 'education', 'SMP atau Sederajat', 760, 2025, 4, true),
  ('c0000001-0000-0000-0000-000000000022', null, 'education', 'SMA atau Sederajat', 1200, 2025, 5, true),
  ('c0000001-0000-0000-0000-000000000023', null, 'education', 'Diploma', 280, 2025, 6, true),
  ('c0000001-0000-0000-0000-000000000024', null, 'education', 'Sarjana', 420, 2025, 7, true),
  ('c0000001-0000-0000-0000-000000000025', null, 'education', 'Pascasarjana', 110, 2025, 8, true),
  -- STATUS PERKAWINAN
  ('c0000001-0000-0000-0000-000000000026', null, 'marital_status', 'Belum Kawin', 1100, 2025, 1, true),
  ('c0000001-0000-0000-0000-000000000027', null, 'marital_status', 'Kawin', 2100, 2025, 2, true),
  ('c0000001-0000-0000-0000-000000000028', null, 'marital_status', 'Cerai Hidup', 80, 2025, 3, true),
  ('c0000001-0000-0000-0000-000000000029', null, 'marital_status', 'Cerai Mati', 230, 2025, 4, true)
on conflict (id) do nothing;

-- ============================================================
-- POTENSI DESA / SUMBER DAYA ALAM
-- ============================================================
insert into public.content_items (id, section, category, title, slug, summary, description, location_name, hamlet_id, metadata, display_order, is_published) values
  ('d0000001-0000-0000-0000-000000000001', 'potential', 'Mata Air', 'Mata Air Sendang', 'mata-air-sendang', 'Mata air utama yang memasok irigasi sawah di tiga dusun.', 'Mata Air Sendang terletak di Dusun Pucung dengan debit air sekitar 50 liter/detik. Sumber air ini dimanfaatkan untuk irigasi persawahan seluas 75 hektare dan kebutuhan air bersih warga. Air mengalir sepanjang tahun meskipun musim kemarau.', 'Dusun Pucung', 'a0000001-0000-0000-0000-000000000003', '{"condition":"Baik","debit":"50 L/dtk","luas_layanan":"75 ha"}', 1, true),
  ('d0000001-0000-0000-0000-000000000002', 'potential', 'Persawahan', 'Persawahan Banyusari', 'persawahan-banyusari', 'Lahan persawahan seluas 185 hektare yang menjadi andalan ekonomi desa.', 'Persawahan di Banyusari mencakup area seluas 185 hektare yang tersebar di lima dusun. Sawah tadah hujan dan irigasi teknis menghasilkan padi dengan produktivitas rata-rata 6,5 ton/hektare per musim tanam. Komoditas unggulan meliputi padi varietas IR64 dan Mentik Wangi.', 'Seluruh Dusun', null, '{"luas":"185 ha","produktivitas":"6,5 ton/ha","jenis":"Irigasi teknis & tadah hujan"}', 2, true)
on conflict (id) do nothing;

-- ============================================================
-- INFRASTRUKTUR (dengan pengukuran)
-- ============================================================
insert into public.content_items (id, section, category, title, slug, summary, description, location_name, hamlet_id, metadata, display_order, is_published) values
  ('d0000001-0000-0000-0000-000000000010', 'infrastructure', 'Jalan', 'Jalan Poros Krajan-Pucung', 'jalan-poros-krajan-pucung', 'Jalan utama penghubung antar dusun sepanjang 2,8 km.', 'Jalan poros yang menghubungkan Dusun Krajan hingga Dusun Pucung. Jalan ini merupakan akses utama warga untuk kegiatan ekonomi dan sosial. Kondisi jalan sudah dihotmix sepanjang 1,6 km dan sisanya masih berupa jalan makadam.', 'Krajan-Pucung', null, '{"condition":"Baik","panjang_meter":2800,"panjang_permanen_meter":1600,"panjang_belum_permanen_meter":1200,"lebar_meter":4.5,"konstruksi":"Hotmix & Makadam"}', 1, true),
  ('d0000001-0000-0000-0000-000000000011', 'infrastructure', 'Jalan', 'Jalan Lingkungan Ngasem', 'jalan-lingkungan-ngasem', 'Jalan lingkungan di Dusun Ngasem sepanjang 1,2 km.', 'Jalan ini melayani akses permukiman warga Dusun Ngasem. Saat ini 800 meter sudah dirabat beton dan 400 meter masih berupa tanah.', 'Dusun Ngasem', 'a0000001-0000-0000-0000-000000000002', '{"condition":"Sedang","panjang_meter":1200,"panjang_permanen_meter":800,"panjang_belum_permanen_meter":400,"lebar_meter":3,"konstruksi":"Rabat beton & tanah"}', 2, true),
  ('d0000001-0000-0000-0000-000000000012', 'infrastructure', 'Irigasi', 'Saluran Irigasi Sendang-Gading', 'saluran-irigasi-sendang-gading', 'Saluran irigasi primer dari Mata Air Sendang ke persawahan Gading.', 'Saluran irigasi sepanjang 3,5 km yang mengalirkan air dari Mata Air Sendang ke area persawahan Dusun Gading dan sekitarnya. Saluran permanen (pasangan batu) sepanjang 2,1 km dan sisanya masih saluran tanah.', 'Sendang-Gading', null, '{"condition":"Baik","panjang_meter":3500,"panjang_permanen_meter":2100,"panjang_belum_permanen_meter":1400,"lebar_meter":1.2,"debit":"40 L/dtk"}', 3, true),
  ('d0000001-0000-0000-0000-000000000013', 'infrastructure', 'Irigasi', 'Saluran Irigasi Tersier Ngasem', 'saluran-irigasi-tersier-ngasem', 'Saluran irigasi tersier di Dusun Ngasem sepanjang 1,8 km.', 'Saluran irigasi yang melayani 45 hektare sawah di Dusun Ngasem. Separuhnya sudah permanen dan sisanya masih perlu peningkatan.', 'Dusun Ngasem', 'a0000001-0000-0000-0000-000000000002', '{"condition":"Sedang","panjang_meter":1800,"panjang_permanen_meter":900,"panjang_belum_permanen_meter":900,"lebar_meter":0.8}'', 4, true)
on conflict (id) do nothing;

-- ============================================================
-- UMKM
-- ============================================================
insert into public.content_items (id, section, category, title, slug, summary, description, location_name, hamlet_id, metadata, display_order, is_published) values
  ('d0000001-0000-0000-0000-000000000020', 'business', 'UMKM', 'Keripik Tempe Sari Rasa', 'keripik-tempe-sari-rasa', 'Produksi keripik tempe rumahan khas Banyusari.', 'UMKM milik Ibu Sariyem yang memproduksi keripik tempe dengan resep turun-temurun. Produksi mencapai 50 kg per minggu dan dipasarkan di wilayah Gunungkidul dan sekitarnya.', 'Dusun Krajan', 'a0000001-0000-0000-0000-000000000001', '{"pemilik":"Sariyem","produksi":"50 kg/minggu","status_aktif":"Aktif"}', 1, true),
  ('d0000001-0000-0000-0000-000000000021', 'business', 'UMKM', 'Gula Jawa Mbok Sum', 'gula-jawa-mbok-sum', 'Produksi gula jawa dari nira kelapa.', 'Usaha produksi gula jawa tradisional milik Ibu Sumarni. Mengolah nira kelapa dari 20 pohon kelapa menjadi gula jawa cetak dan gula semut. Kapasitas produksi 100 kg per bulan.', 'Dusun Pucung', 'a0000001-0000-0000-0000-000000000003', '{"pemilik":"Sumarni","produksi":"100 kg/bulan","status_aktif":"Aktif"}', 2, true)
on conflict (id) do nothing;

-- ============================================================
-- KELEMBAGAAN (PKK dengan status)
-- ============================================================
insert into public.content_items (id, section, category, title, slug, summary, description, location_name, hamlet_id, metadata, display_order, is_published) values
  ('d0000001-0000-0000-0000-000000000030', 'institution', 'PKK', 'TP PKK Desa Banyusari', 'tp-pkk-desa-banyusari', 'Tim Penggerak PKK Desa Banyusari yang aktif dalam pemberdayaan keluarga.', 'TP PKK Desa Banyusari memiliki 10 kader aktif yang menjalankan 10 program pokok PKK. Kegiatan meliputi posyandu, pengelolaan warung hidup, pelatihan keterampilan, dan dasawisma. Pertemuan rutin setiap tanggal 15.', 'Balai Desa Banyusari', null, '{"ketua":"Siti Nurhayati","jumlah_kader":"10","jadwal":"Tanggal 15 setiap bulan","status_aktif":"Aktif"}', 1, true),
  ('d0000001-0000-0000-0000-000000000031', 'institution', 'PKK', 'PKK Dusun Krajan', 'pkk-dusun-krajan', 'PKK tingkat dusun yang aktif mengelola warung hidup dan posyandu.', 'PKK Dusun Krajan memiliki 5 kader yang fokus pada program warung hidup, penanaman TOGA, dan dukungan posyandu balita.', 'Dusun Krajan', 'a0000001-0000-0000-0000-000000000001', '{"ketua":"Wagiyem","jumlah_kader":"5","status_aktif":"Aktif"}', 2, true)
on conflict (id) do nothing;

-- ============================================================
-- PELAYANAN (Posyandu dengan status)
-- ============================================================
insert into public.content_items (id, section, category, title, slug, summary, description, location_name, hamlet_id, metadata, display_order, is_published) values
  ('d0000001-0000-0000-0000-000000000040', 'service', 'Posyandu Balita', 'Posyandu Mawar Krajan', 'posyandu-mawar-krajan', 'Posyandu balita yang melayani 45 anak di Dusun Krajan.', 'Posyandu Mawar melayani penimbangan, imunisasi, dan penyuluhan gizi balita setiap hari Kamis pon. Dikelola oleh 3 kader aktif.', 'Dusun Krajan', 'a0000001-0000-0000-0000-000000000001', '{"kader":"3","jumlah_balita":"45","jadwal":"Kamis Pon","status_aktif":"Aktif"}', 1, true),
  ('d0000001-0000-0000-0000-000000000041', 'service', 'Posyandu Lansia', 'Posyandu Lansia Sehat Ngasem', 'posyandu-lansia-sehat-ngasem', 'Posyandu lansia yang melayani pemeriksaan kesehatan rutin.', 'Posyandu Lansia Sehat melayani 30 lansia dengan kegiatan senam, cek tekanan darah, dan penyuluhan kesehatan setiap hari Jumat Legi.', 'Dusun Ngasem', 'a0000001-0000-0000-0000-000000000002', '{"kader":"2","jumlah_lansia":"30","jadwal":"Jumat Legi","status_aktif":"Aktif"}', 2, true),
  ('d0000001-0000-0000-0000-000000000042', 'service', 'Posyandu Remaja', 'Posyandu Remaja Pelita', 'posyandu-remaja-pelita', 'Posyandu remaja untuk edukasi kesehatan reproduksi dan gizi.', 'Posyandu Remaja Pelita melayani 25 remaja dengan kegiatan edukasi kesehatan reproduksi, cek hemoglobin, dan penyuluhan gizi seimbang setiap hari Sabtu.', 'Balai Dusun Pucung', 'a0000001-0000-0000-0000-000000000003', '{"kader":"2","jumlah_remaja":"25","jadwal":"Sabtu","status_aktif":"Aktif"}', 3, true)
on conflict (id) do nothing;

-- ============================================================
-- PERUMAHAN (RTLH dengan foto)
-- ============================================================
insert into public.content_items (id, section, category, title, slug, summary, description, location_name, hamlet_id, metadata, display_order, is_published) values
  ('d0000001-0000-0000-0000-000000000050', 'housing', 'Rumah Tidak Layak Huni', 'RTLH – Rumah Bapak Paimin', 'rtlh-rumah-bapak-paimin', 'Rumah tidak layak huni milik Bapak Paimin di Dusun Nglarang.', 'Rumah milik Bapak Paimin (65 tahun) berlantai tanah, berdinding anyaman bambu sebagian rusak, dan atap bocor. Luas bangunan 36 m². Belum memiliki akses listrik mandiri. Penghuni: 3 jiwa.', 'RT 03 Dusun Nglarang', 'a0000001-0000-0000-0000-000000000005', '{"condition":"Rusak Berat","penghuni":"3 jiwa","luas_bangunan":"36 m²","status_aktif":"Belum tertangani","images":[]}', 1, true),
  ('d0000001-0000-0000-0000-000000000051', 'housing', 'Rumah Tidak Layak Huni', 'RTLH – Rumah Ibu Sariyem', 'rtlh-rumah-ibu-sariyem', 'Rumah tidak layak huni milik Ibu Sariyem di Dusun Gading.', 'Rumah milik Ibu Sariyem (58 tahun) dengan dinding setengah tembok, lantai tanah, dan belum memiliki sanitasi layak. Luas bangunan 30 m². Penghuni: 2 jiwa (lansia).', 'RT 02 Dusun Gading', 'a0000001-0000-0000-0000-000000000004', '{"condition":"Rusak Sedang","penghuni":"2 jiwa","luas_bangunan":"30 m²","status_aktif":"Dalam proses bantuan","images":[]}', 2, true)
on conflict (id) do nothing;

-- ============================================================
-- BERITA
-- ============================================================
insert into public.posts (id, post_type, title, slug, excerpt, content, status, published_at) values
  ('e0000001-0000-0000-0000-000000000001', 'Berita', 'Pembangunan Jalan Poros Krajan-Pucung Dimulai', 'pembangunan-jalan-poros-krajan-pucung', 'Pemerintah Desa memulai pembangunan jalan poros penghubung Dusun Krajan-Pucung.', 'Pembangunan Jalan Poros Krajan-Pucung secara resmi dimulai pada Senin, 15 Januari 2025. Proyek ini mencakup peningkatan jalan sepanjang 2,8 km dengan anggaran dari Dana Desa tahun 2025. Pembangunan ditargetkan selesai dalam 6 bulan dan akan menggunakan konstruksi hotmix pada ruas utama.\n\nKepala Desa Banyusari, Bapak Slamet Riyadi, menyampaikan bahwa jalan ini merupakan akses vital bagi perekonomian warga dan hasil pertanian. Masyarakat diharapkan mendukung dan menjaga infrastruktur yang telah dibangun.', 'published', '2025-01-15T08:00:00Z'),
  ('e0000001-0000-0000-0000-000000000002', 'Pengumuman', 'Jadwal Posyandu Bulanan Tahun 2025', 'jadwal-posyandu-bulanan-2025', 'Berikut jadwal posyandu balita dan lansia se-Desa Banyusari.', 'Diberitahukan kepada seluruh warga Desa Banyusari, berikut adalah jadwal posyandu rutin:\n\n1. Posyandu Mawar (Krajan): Kamis Pon\n2. Posyandu Sehat (Ngasem): Jumat Legi\n3. Posyandu Pelita (Pucung): Sabtu\n4. Posyandu Melati (Gading): Selasa Pahing\n5. Posyandu Flamboyan (Nglarang): Rabu Kliwon\n\nWaktu pelayanan pukul 08.00 - 11.00 WIB.', 'published', '2025-01-05T07:00:00Z')
on conflict (id) do nothing;
