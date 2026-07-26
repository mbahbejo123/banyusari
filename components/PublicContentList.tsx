import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import PageHero from "@/components/PageHero";
import { sectionConfig } from "@/lib/config";
import { getPublishedContent } from "@/lib/data";
import type { ContentSection } from "@/lib/types";

export default async function PublicContentList({ section }: { section: ContentSection }) {
  const config = sectionConfig[section];
  const items = await getPublishedContent(section);

  return (
    <main>
      <PageHero eyebrow="Informasi Desa" title={config.label} description={config.description} />
      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <EmptyState title={`Belum ada data ${config.label.toLowerCase()}`} description="Admin belum memublikasikan data pada bagian ini." />
          ) : (
            <div className="card-grid">
              {items.map((item) => (
                <article className="content-card" key={item.id}>
                  {item.cover_image_url ? <img src={item.cover_image_url} alt={item.title} /> : <div className="image-placeholder">Belum ada gambar</div>}
                  <div className="content-card-body">
                    <span className="tag">{item.category}</span>
                    <h2>{item.title}</h2>
                    <p>{item.summary || "Deskripsi singkat belum diisi."}</p>
                    <Link className="text-link" href={`${config.publicPath}/${item.slug}`}>Lihat detail →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
