import Link from "next/link";
import { getPublicSettings } from "@/lib/data";

const navigation = [
  ["/", "Beranda"],
  ["/profil", "Profil"],
  ["/dusun", "Dusun"],
  ["/penduduk", "Penduduk"],
  ["/potensi", "Potensi"],
  ["/infrastruktur", "Infrastruktur"],
  ["/usaha", "BUMDes dan UMKM"],
  ["/kelembagaan", "Kelembagaan"],
  ["/pelayanan", "Pelayanan"],
  ["/perumahan", "Perumahan"],
  ["/berita", "Berita"],
  ["/galeri", "Galeri"],
  ["/kontak", "Kontak"],
];

export default async function SiteHeader() {
  const settings = await getPublicSettings();
  const name = settings?.village_name || "Portal Desa";
  const subtitle = settings?.district || "Website Resmi Pemerintah Desa";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={`Logo ${name}`} />
          ) : (
            <span className="brand-placeholder">DS</span>
          )}
          <span>
            <strong>{name}</strong>
            <small>{subtitle}</small>
          </span>
        </Link>
        <details className="nav-details">
          <summary>Menu</summary>
          <nav>
            {navigation.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </nav>
        </details>
        <nav className="desktop-nav">
          {navigation.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
