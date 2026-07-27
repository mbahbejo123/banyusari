import Link from "next/link";
import { getPublicSettings, getPublishedGallery } from "@/lib/data";
import { IconBrandFacebook, IconBrandInstagram, IconBrandYoutube, IconBrandWhatsapp } from "@tabler/icons-react";

export default async function SiteFooter() {
  const [settings, gallery] = await Promise.all([
    getPublicSettings(),
    getPublishedGallery(),
  ]);
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
          {settings?.facebook_url || settings?.instagram_url || settings?.youtube_url || settings?.phone ? (
            <div className="footer-sosmed">
              {settings.facebook_url ? (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="sosmed-link" title="Facebook">
                  <IconBrandFacebook size={20} />
                </a>
              ) : null}
              {settings.instagram_url ? (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="sosmed-link" title="Instagram">
                  <IconBrandInstagram size={20} />
                </a>
              ) : null}
              {settings.youtube_url ? (
                <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="sosmed-link" title="YouTube">
                  <IconBrandYoutube size={20} />
                </a>
              ) : null}
              {settings?.phone ? (
                <a href={`https://wa.me/${settings.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="sosmed-link" title="WhatsApp">
                  <IconBrandWhatsapp size={20} />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
        <div>
          <h3>Informasi</h3>
          <Link href="/profil">Profil Desa</Link>
          <Link href="/penduduk">Data Penduduk</Link>
          <Link href="/berita">Berita</Link>
          <Link href="/galeri">Galeri</Link>
          <Link href="/admin/login">Login Admin</Link>
        </div>
        <div>
          <h3>Kontak</h3>
          <p>{settings?.phone || "Nomor telepon belum tersedia."}</p>
          <p>{settings?.email || "Surel belum tersedia."}</p>
          {settings?.office_maps_url ? (
            <a className="button primary" href={settings.office_maps_url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", marginTop: 12 }}>
              Buka Google Maps
            </a>
          ) : null}
        </div>
      </div>
      {gallery.length > 0 ? (
        <div className="container footer-gallery">
          <h3>Galeri Foto</h3>
          <div className="footer-gallery-grid">
            {gallery.slice(0, 6).map((item) => (
              <Link key={item.id} href="/galeri" className="footer-gallery-thumb">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title || ""} />
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <div className="container footer-bottom">
        <span>© 2026 Pemerintah Desa {settings?.village_name || "Banyusari"}</span>
      </div>
    </footer>
  );
}
