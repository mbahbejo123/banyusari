import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getPublishedPost } from "@/lib/data";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  return <main><PageHero eyebrow={post.post_type} title={post.title} description={post.excerpt} /><section className="section"><article className="container detail-panel" style={{maxWidth:850}}>{post.cover_image_url ? <img className="detail-image" src={post.cover_image_url} alt={post.title} /> : null}<div className="prose">{post.content || "Isi berita belum tersedia."}</div></article></section></main>;
}
