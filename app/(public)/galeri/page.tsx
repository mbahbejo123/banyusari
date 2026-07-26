import EmptyState from "@/components/EmptyState";
import PageHero from "@/components/PageHero";
import { getPublishedGallery } from "@/lib/data";

export default async function GalleryPage() {
  const items = await getPublishedGallery();
  return <main><PageHero eyebrow="Dokumentasi" title="Galeri Desa" description="Dokumentasi kegiatan, wilayah, pembangunan, dan potensi desa." /><section className="section"><div className="container">{items.length === 0 ? <EmptyState title="Galeri belum berisi gambar" /> : <div className="gallery-grid">{items.map((item) => <article className="gallery-item" key={item.id}><img src={item.image_url} alt={item.title} /><div className="gallery-caption"><span className="tag">{item.category || "Galeri"}</span><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>}</div></section></main>;
}
