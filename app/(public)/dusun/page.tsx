import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import PageHero from "@/components/PageHero";
import { getPublishedHamlets } from "@/lib/data";

export default async function HamletsPage() {
  const hamlets = await getPublishedHamlets();
  return <main><PageHero eyebrow="Wilayah Desa" title="Dusun" description="Informasi enam dusun dan wilayah administrasinya." /><section className="section"><div className="container">{hamlets.length === 0 ? <EmptyState title="Data dusun belum dipublikasikan" description="Admin dapat menambahkan enam dusun melalui dashboard." /> : <div className="card-grid">{hamlets.map((item) => <article className="content-card" key={item.id}>{item.image_url ? <img src={item.image_url} alt={item.name} /> : <div className="image-placeholder">Belum ada gambar</div>}<div className="content-card-body"><h2>{item.name}</h2><p>{item.description || "Deskripsi belum diisi."}</p><Link className="text-link" href={`/dusun/${item.slug}`}>Lihat detail →</Link></div></article>)}</div>}</div></section></main>;
}
