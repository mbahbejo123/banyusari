import EmptyState from "@/components/EmptyState";
import PageHero from "@/components/PageHero";
import { populationTypeLabels } from "@/lib/config";
import { getPublishedPopulation } from "@/lib/data";

function hamletName(row: { hamlets?: { name: string } | null }): string {
  return row.hamlets?.name || "Seluruh Desa";
}

export default async function PopulationPage({ searchParams }: { searchParams: Promise<{ tahun?: string }> }) {
  const { tahun } = await searchParams;
  const statistics = await getPublishedPopulation();
  const years = [...new Set(statistics.map((item) => item.period_year))].sort((a, b) => b - a);
  const latestYear = years[0];
  const activeYear = tahun ? Number(tahun) : latestYear;
  const filtered = statistics.filter((item) => item.period_year === activeYear);

  if (filtered.length === 0) {
    return <main><PageHero eyebrow="Data Desa" title="Data Penduduk" description="Statistik penduduk belum tersedia." /><section className="section"><div className="container"><EmptyState title="Data kependudukan belum dipublikasikan" /></div></section></main>;
  }

  const hamlets = [...new Set(filtered.map(hamletName))];
  const types = ["gender", "education", "marital_status", "age"] as const;

  function rows(type: string) { return filtered.filter((r) => r.statistic_type === type); }
  function categories(rr: typeof filtered) { return [...new Set(rr.map((r) => r.category))]; }
  function byHamlet(rr: typeof filtered) {
    const m: Record<string, number> = {};
    for (const r of rr) {
      const h = hamletName(r);
      m[h] = (m[h] || 0) + r.total;
    }
    return m;
  }

  const genderRows = rows("gender");
  const genderCats = categories(genderRows);

  return (
    <main>
      <PageHero eyebrow="Data Desa" title="Data Penduduk" description={`Statistik penduduk periode ${activeYear}.`} />
      <section className="section">
        <div className="container">
          {years.length > 1 && (
            <div className="tahun-picker">
              {years.map((y) => (
                <a key={y} href={`/penduduk?tahun=${y}`} className={`button small ${y === activeYear ? "primary" : "secondary"}`} style={{ minWidth: 80, textAlign: "center" }}>{y}</a>
              ))}
            </div>
          )}
          {/* Jenis Kelamin — kartu statistik */}
          <section className="population-group">
            <h2>{populationTypeLabels.gender}</h2>
            <div className="stats-grid">
              {genderCats.map((cat) => {
                const total = genderRows.filter((r) => r.category === cat).reduce((s, r) => s + r.total, 0);
                return <div className="stat-card" key={cat}><strong>{total.toLocaleString("id-ID")}</strong><span>{cat}</span></div>;
              })}
              <div className="stat-card">
                <strong>{genderRows.reduce((s, r) => s + r.total, 0).toLocaleString("id-ID")}</strong>
                <span>Total Jiwa</span>
              </div>
            </div>
            {hamlets.length > 1 && (
              <div style={{ overflowX: "auto", marginTop: 16 }}>
                <table className="population-table">
                  <thead><tr><th>Wilayah</th>{genderCats.map((c) => <th key={c}>{c}</th>)}<th>Total</th></tr></thead>
                  <tbody>{hamlets.map((h) => {
                    const hh = genderRows.filter((r) => hamletName(r) === h);
                    const hTotals = genderCats.map((c) => hh.filter((r) => r.category === c).reduce((s, r) => s + r.total, 0));
                    return <tr key={h}><td>{h}</td>{hTotals.map((t, i) => <td key={i}>{t.toLocaleString("id-ID")}</td>)}<td><strong>{hTotals.reduce((a, b) => a + b, 0).toLocaleString("id-ID")}</strong></td></tr>;
                  })}</tbody>
                </table>
              </div>
            )}
          </section>

          {/* Pendidikan, Status Perkawinan, Klasifikasi Umur — tabel pivot */}
          {(["education", "marital_status", "age"] as const).map((type) => {
            const rr = rows(type);
            if (!rr.length) return null;
            const cats = categories(rr);
            const totals = byHamlet(rr);
            return (
              <section className="population-group" key={type}>
                <h2>{populationTypeLabels[type]}</h2>
                <div style={{ overflowX: "auto" }}>
                  <table className="population-table">
                    <thead><tr><th>Kategori</th>{hamlets.map((h) => <th key={h}>{h}</th>)}<th>Total</th></tr></thead>
                    <tbody>{cats.map((cat) => {
                      let catTotal = 0;
                      return <tr key={cat}><td>{cat}</td>{hamlets.map((h) => {
                        const val = rr.find((r) => r.category === cat && hamletName(r) === h);
                        catTotal += val?.total || 0;
                        return <td key={h}>{(val?.total || 0).toLocaleString("id-ID")}</td>;
                      })}<td><strong>{catTotal.toLocaleString("id-ID")}</strong></td></tr>;
                    })}</tbody>
                    <tfoot><tr><th>Total</th>{hamlets.map((h) => <th key={h}>{(totals[h] || 0).toLocaleString("id-ID")}</th>)}<th>{Object.values(totals).reduce((a, b) => a + b, 0).toLocaleString("id-ID")}</th></tr></tfoot>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
