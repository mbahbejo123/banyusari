import EmptyState from "@/components/EmptyState";
import PageHero from "@/components/PageHero";
import { populationTypeLabels } from "@/lib/config";
import { getPublishedPopulation } from "@/lib/data";

export default async function PopulationPage() {
  const statistics = await getPublishedPopulation();
  const years = [...new Set(statistics.map((item) => item.period_year))];
  const latestYear = years[0];
  const latest = statistics.filter((item) => item.period_year === latestYear);
  const types = ["gender", "education", "marital_status", "age"] as const;
  return <main><PageHero eyebrow="Data Desa" title="Data Penduduk" description={latestYear ? `Statistik penduduk periode ${latestYear}.` : "Statistik penduduk belum tersedia."} /><section className="section"><div className="container">{latest.length === 0 ? <EmptyState title="Data kependudukan belum dipublikasikan" /> : types.map((type) => { const rows = latest.filter((item) => item.statistic_type === type); if (!rows.length) return null; return <section className="population-group" key={type}><h2>{populationTypeLabels[type]}</h2><div style={{overflowX:"auto"}}><table className="population-table"><thead><tr><th>Kategori</th><th>Wilayah</th><th>Jumlah</th><th>Tahun</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.category}</td><td>{row.hamlets?.name || "Seluruh Desa"}</td><td>{row.total.toLocaleString("id-ID")}</td><td>{row.period_year}</td></tr>)}</tbody></table></div></section>; })}</div></section></main>;
}
