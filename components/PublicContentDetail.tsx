import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { contentFieldRules, sectionConfig } from "@/lib/config";
import { getPublishedContentBySlug } from "@/lib/data";
import type { ContentSection } from "@/lib/types";

function humanize(key: string) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function PublicContentDetail({
  section,
  slug,
}: {
  section: ContentSection;
  slug: string;
}) {
  const item = await getPublishedContentBySlug(section, slug);
  if (!item) notFound();
  const config = sectionConfig[section];
  const rules = contentFieldRules[`${section}:${item.category}` as keyof typeof contentFieldRules] || {};
  const images: string[] = Array.isArray(item.metadata?.images)
    ? item.metadata.images
    : [];
  const metadata = Object.entries(item.metadata || {}).filter(
    ([key, value]) =>
      key !== "images" && value !== null && value !== ""
  );

  return (
    <main>
      <PageHero
        eyebrow={`${config.label} · ${item.category}`}
        title={item.title}
        description={item.summary}
      />
      <section className="section">
        <div className="container detail-layout">
          <article className="detail-panel">
            {item.cover_image_url ? (
              <img
                className="detail-image"
                src={item.cover_image_url}
                alt={item.title}
              />
            ) : null}
            <h2>Deskripsi</h2>
            <div className="prose">
              {item.description || "Deskripsi lengkap belum diisi oleh admin."}
            </div>

            {images.length > 0 && rules.galleryLabel ? (
              <>
                <h2>{rules.galleryLabel}</h2>
                <div className="gallery-thumbs">
                  {images.map((url, index) => (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="gallery-thumb"
                      key={index}
                    >
                      <img src={url} alt={`Foto ${index + 1}`} />
                    </a>
                  ))}
                </div>
              </>
            ) : null}
          </article>

          <aside className="detail-sidebar">
            <h2>Informasi</h2>
            <dl>
              <div>
                <dt>Kategori</dt>
                <dd>{item.category}</dd>
              </div>
              {item.hamlets?.name ? (
                <div>
                  <dt>Dusun</dt>
                  <dd>{item.hamlets.name}</dd>
                </div>
              ) : null}
              {item.location_name ? (
                <div>
                  <dt>Lokasi</dt>
                  <dd>{item.location_name}</dd>
                </div>
              ) : null}

              {rules.measurements ? (
                <>
                  {item.metadata?.panjang_meter ? (
                    <div>
                      <dt>Total Panjang</dt>
                      <dd>{item.metadata.panjang_meter} m</dd>
                    </div>
                  ) : null}
                  {item.metadata?.panjang_permanen_meter ? (
                    <div>
                      <dt>Permanen</dt>
                      <dd>{item.metadata.panjang_permanen_meter} m</dd>
                    </div>
                  ) : null}
                  {item.metadata?.panjang_belum_permanen_meter ? (
                    <div>
                      <dt>Belum Permanen</dt>
                      <dd>{item.metadata.panjang_belum_permanen_meter} m</dd>
                    </div>
                  ) : null}
                  {item.metadata?.lebar_meter ? (
                    <div>
                      <dt>Lebar</dt>
                      <dd>{item.metadata.lebar_meter} m</dd>
                    </div>
                  ) : null}
                </>
              ) : null}

              {metadata.map(([key, value]) => (
                <div key={key}>
                  <dt>{humanize(key)}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>

            {item.maps_url ? (
              <a
                className="button primary full"
                href={item.maps_url}
                target="_blank"
                rel="noreferrer"
              >
                Buka Google Maps
              </a>
            ) : (
              <p className="muted">
                Tautan Google Maps belum tersedia.
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
