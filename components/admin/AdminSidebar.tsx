import Link from "next/link";
import { sectionConfig } from "@/lib/config";

const primary = [
  ["/admin", "Ringkasan"],
  ["/admin/pengaturan", "Profil Desa"],
  ["/admin/dusun", "Dusun"],
  ["/admin/penduduk", "Data Penduduk"],
  ["/admin/perangkat", "Perangkat Desa"],
  ["/admin/impor", "Impor Data Excel"],
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">CMS Desa</div>
      <nav>
        {primary.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        <p className="sidebar-label">Konten Desa</p>
        {Object.entries(sectionConfig).map(([section, config]) => (
          <Link key={section} href={`/admin/konten/${section}`}>{config.label}</Link>
        ))}
        <p className="sidebar-label">Publikasi</p>
        <Link href="/admin/berita">Berita dan Pengumuman</Link>
        <Link href="/admin/galeri">Galeri</Link>
        <Link href="/">Lihat Website</Link>
      </nav>
    </aside>
  );
}
