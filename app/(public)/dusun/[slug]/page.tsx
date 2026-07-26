import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";

export default async function HamletDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase.from("hamlets").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!item) notFound();
  return <main><PageHero eyebrow="Dusun" title={item.name} description={item.description} /><section className="section"><div className="container detail-layout"><article className="detail-panel">{item.image_url ? <img className="detail-image" src={item.image_url} alt={item.name} /> : null}<h2>Profil Dusun</h2><div className="prose">{item.description || "Deskripsi belum diisi."}</div></article><aside className="detail-sidebar"><h2>Informasi</h2><dl><div><dt>Kepala Dusun</dt><dd>{item.head_name || "Belum diisi"}</dd></div><div><dt>Jumlah Penduduk</dt><dd>{item.population_total ?? "Belum diisi"}</dd></div><div><dt>Luas Wilayah</dt><dd>{item.area_size ? `${item.area_size} ha` : "Belum diisi"}</dd></div></dl>{item.maps_url ? <a className="button primary full" href={item.maps_url} target="_blank" rel="noreferrer">Buka Google Maps</a> : <p className="muted">Tautan lokasi belum tersedia.</p>}</aside></div></section></main>;
}
