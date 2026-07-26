import Link from "next/link";
import { getPublicSettings } from "@/lib/data";

export default async function SiteFooter() {
  const settings = await getPublicSettings();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2>{settings?.village_name || "Portal Desa"}</h2>
          <p>{settings?.address || "Alamat kantor desa belum diisi oleh admin."}</p>
          <p>
            {[settings?.district, settings?.regency, settings?.province]
              .filter(Boolean)
              .join(", ") || "Wilayah administratif belum diisi."}
          </p>
        </div>
        <div>
          <h3>Informasi</h3>
          <Link href="/profil">Profil Desa</Link>
          <Link href="/penduduk">Data Penduduk</Link>
          <Link href="/berita">Berita</Link>
          <Link href="/admin/login">Login Admin</Link>
        </div>
        <div>
          <h3>Kontak</h3>
          <p>{settings?.phone || "Nomor telepon belum tersedia."}</p>
          <p>{settings?.email || "Surel belum tersedia."}</p>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 Pemerintah Desa</div>
    </footer>
  );
}
