import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import PageHero from "@/components/PageHero";
import { getPublishedPosts } from "@/lib/data";

export default async function NewsPage() {
  const posts = await getPublishedPosts();
  return <main><PageHero eyebrow="Publikasi Desa" title="Berita dan Pengumuman" description="Informasi resmi kegiatan, agenda, pembangunan, dan pengumuman desa." /><section className="section"><div className="container">{posts.length === 0 ? <EmptyState title="Belum ada berita yang diterbitkan" /> : <div className="card-grid">{posts.map((post) => <article className="content-card" key={post.id}>{post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} /> : <div className="image-placeholder">Belum ada gambar</div>}<div className="content-card-body"><span className="tag">{post.post_type}</span><h2>{post.title}</h2><p>{post.excerpt}</p><Link className="text-link" href={`/berita/${post.slug}`}>Baca selengkapnya →</Link></div></article>)}</div>}</div></section></main>;
}
