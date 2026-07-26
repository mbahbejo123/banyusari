import ExcelImportClient from "@/components/admin/ExcelImportClient";

export default function ImportPage() {
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Impor Data Excel</h1>
          <p>
            Masukkan banyak data sekaligus untuk profil, dusun, penduduk, perangkat,
            potensi, infrastruktur, usaha, kelembagaan, pelayanan, perumahan, berita,
            dan galeri.
          </p>
        </div>
      </div>

      <ExcelImportClient />

      <div className="admin-panel import-notes">
        <h2>Ketentuan penting</h2>
        <ul>
          <li>Jangan mengubah nama sheet dan judul kolom pada template.</li>
          <li>Kolom slug boleh dikosongkan karena sistem akan membuatnya dari nama atau judul.</li>
          <li>Isi publikasi dengan <strong>Ya</strong> atau <strong>Tidak</strong>.</li>
          <li>Kolom slug dusun harus sama dengan slug pada sheet Dusun.</li>
          <li>Gambar dalam Excel tidak diunggah otomatis. Gunakan URL gambar publik atau tambahkan gambar melalui formulir edit setelah impor.</li>
          <li>Lakukan Validasi Berkas terlebih dahulu. Jika ada kesalahan, tidak ada data yang ditulis.</li>
        </ul>
      </div>
    </>
  );
}
