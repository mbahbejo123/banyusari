import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import EmptyState from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { sectionConfig, populationTypeLabels } from "@/lib/config";
import { getContentByHamlet, getPopulationByHamlet } from "@/lib/data";
import type { ContentSection } from "@/lib/types";

const sections: ContentSection[] = ["potential", "infrastructure", "business", "institution", "service", "housing"];

export default async function HamletDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("hamlets")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!item) notFound();

  const contentItems = await getContentByHamlet(item.id);
  const population = await getPopulationByHamlet(item.id);
  const groupedContent = new Map<string, typeof contentItems>();
  for (const ci of contentItems) {
    const list = groupedContent.get(ci.section) || [];
    list.push(ci);
    groupedContent.set(ci.section, list);
  }
  const latestYear = population.length > 0
    ? Math.max(...population.map((p) => p.period_year))
    : null;
  const latestPopulation = population.filter((p) => p.period_year === latestYear);
  const popTypes = ["gender", "age", "education", "marital_status"] as const;

  return (
    <main>
      <PageHero
        eyebrow="Dusun"
        title={item.name}
        description={item.description}
      />
      <section className="section">
        <div className="container detail-layout">
          <article className="detail-panel">
            {item.image_url ? (
              <img className="detail-image" src={item.image_url} alt={item.name} />
            ) : null}

            <h2>Profil Dusun</h2>
            <div className="prose">{item.description || "Deskripsi belum diisi."}</div>

            {latestPopulation.length > 0 ? (
              <>
                <h2>Data Penduduk</h2>
                {latestYear ? <p className="muted">Periode {latestYear}</p> : null}
                <div style={{ overflowX: "auto" }}>
                  {popTypes.map((type) => {
                    const rows = latestPopulation.filter((r) => r.statistic_type === type);
                    if (!rows.length) return null;
                    return (
                      <section className="population-group" key={type}>
                        <h3>{populationTypeLabels[type]}</h3>
                        <table className="population-table">
                          <thead>
                            <tr>
                              <th>Kategori</th>
                              <th>Jumlah</th>
                              <th>Tahun</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => (
                              <tr key={row.id}>
                                <td>{row.category}</td>
                                <td>{row.total.toLocaleString("id-ID")}</td>
                                <td>{row.period_year}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </section>
                    );
                  })}
                </div>
              </>
            ) : null}

            {sections.map((sec) => {
              const items = groupedContent.get(sec) || [];
              const cfg = sectionConfig[sec];
              if (!items.length) return null;
              return (
                <div key={sec} style={{ marginTop: "32px" }}>
                  <h2>{cfg.label}</h2>
                  <div className="compact-grid">
                    {items.map((ci) => (
                      <article className="simple-card" key={ci.id}>
                        {ci.cover_image_url ? (
                          <img
                            src={ci.cover_image_url}
                            alt={ci.title}
                            style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, marginBottom: 12 }}
                          />
                        ) : null}
                        <span className="tag">{ci.category}</span>
                        <h3>{ci.title}</h3>
                        <p>{ci.summary || ""}</p>
                        <Link className="text-link" href={`${cfg.publicPath}/${ci.slug}`}>
                          Lihat detail &rarr;
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </article>

          <aside className="detail-sidebar">
            <h2>Informasi</h2>
            <dl>
              <div>
                <dt>Kepala Dusun</dt>
                <dd>{item.head_name || "Belum diisi"}</dd>
              </div>
              <div>
                <dt>Jumlah Penduduk</dt>
                <dd>{item.population_total?.toLocaleString("id-ID") ?? "Belum diisi"}</dd>
              </div>
              <div>
                <dt>Luas Wilayah</dt>
                <dd>{item.area_size ? `${item.area_size} ha` : "Belum diisi"}</dd>
              </div>
            </dl>
            {item.maps_url ? (
              <a className="button primary full" href={item.maps_url} target="_blank" rel="noreferrer">
                Buka Google Maps
              </a>
            ) : (
              <p className="muted">Tautan lokasi belum tersedia.</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
