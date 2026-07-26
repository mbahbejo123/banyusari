import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { sectionConfig } from "@/lib/config";
import { getPublishedContentBySlug } from "@/lib/data";
import type { ContentSection } from "@/lib/types";

function humanize(key: string) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function PublicContentDetail({ section, slug }: { section: ContentSection; slug: string }) {
  const item = await getPublishedContentBySlug(section, slug);
  if (!item) notFound();
  const config = sectionConfig[section];
  const metadata = Object.entries(item.metadata || {}).filter(([, value]) => value !== null && value !== "");

  return (
    <main>
      <PageHero eyebrow={`${config.label} · ${item.category}`} title={item.title} description={item.summary} />
      <section className="section">
        <div className="container detail-layout">
          <article className="detail-panel">
            {item.cover_image_url ? <img className="detail-image" src={item.cover_image_url} alt={item.title} /> : null}
            <h2>Deskripsi</h2>
            <div className="prose">{item.description || "Deskripsi lengkap belum diisi oleh admin."}</div>
          </article>
          <aside className="detail-sidebar">
            <h2>Informasi</h2>
            <dl>
              <div><dt>Kategori</dt><dd>{item.category}</dd></div>
              {item.hamlets?.name ? <div><dt>Dusun</dt><dd>{item.hamlets.name}</dd></div> : null}
              {item.location_name ? <div><dt>Lokasi</dt><dd>{item.location_name}</dd></div> : null}
              {metadata.map(([key, value]) => <div key={key}><dt>{humanize(key)}</dt><dd>{String(value)}</dd></div>)}
            </dl>
            {item.maps_url ? <a className="button primary full" href={item.maps_url} target="_blank" rel="noreferrer">Buka Google Maps</a> : <p className="muted">Tautan Google Maps belum tersedia.</p>}
          </aside>
        </div>
      </section>
    </main>
  );
}
