import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [hamlets, population, content, posts, gallery] = await Promise.all([
    supabase.from("hamlets").select("id", { count: "exact", head: true }),
    supabase.from("population_statistics").select("id", { count: "exact", head: true }),
    supabase.from("content_items").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("gallery_items").select("id", { count: "exact", head: true }),
  ]);
  return <><div className="admin-heading"><div><h1>Dashboard</h1><p>Kelola seluruh data yang ditampilkan pada website desa.</p></div></div><div className="admin-grid"><div className="admin-stat"><strong>{hamlets.count || 0}</strong><span>Dusun</span></div><div className="admin-stat"><strong>{population.count || 0}</strong><span>Statistik Penduduk</span></div><div className="admin-stat"><strong>{content.count || 0}</strong><span>Konten Desa</span></div><div className="admin-stat"><strong>{posts.count || 0}</strong><span>Berita</span></div><div className="admin-stat"><strong>{gallery.count || 0}</strong><span>Foto Galeri</span></div></div><div className="admin-panel"><h2>Urutan pengisian yang disarankan</h2><ol><li>Isi Profil Desa dan publikasikan.</li><li>Tambahkan enam dusun.</li><li>Masukkan statistik penduduk.</li><li>Tambahkan perangkat desa.</li><li>Isi potensi, infrastruktur, BUMDes, UMKM, kelembagaan, pelayanan, dan perumahan.</li><li>Tambahkan berita dan galeri.</li></ol></div></>;
}
