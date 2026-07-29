import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import NewsTicker from "@/components/NewsTicker";
import TypedHero from "@/components/TypedHero";
import { getPublicSettings, getPublishedContent, getPublishedHamlets, getPublishedPopulation, getPublishedPosts } from "@/lib/data";
import { IconMap, IconPhoto, IconClipboardList, IconBuildingStore, IconNews, IconBuildingBridge, IconLeaf, IconPhone } from "@tabler/icons-react";

const shortcuts = [
  { href: "/dusun", icon: IconMap, label: "Peta Dusun" },
  { href: "/galeri", icon: IconPhoto, label: "Galeri" },
  { href: "/pelayanan", icon: IconClipboardList, label: "Pelayanan" },
  { href: "/usaha", icon: IconBuildingStore, label: "UMKM" },
  { href: "/berita", icon: IconNews, label: "Berita" },
  { href: "/infrastruktur", icon: IconBuildingBridge, label: "Infrastruktur" },
  { href: "/potensi", icon: IconLeaf, label: "Potensi" },
  { href: "/kontak", icon: IconPhone, label: "Kontak" },
];

export default async function HomePage() {
  const [settings, hamlets, population, potentials, infrastructures, posts] = await Promise.all([
    getPublicSettings(),
    getPublishedHamlets(),
    getPublishedPopulation(),
    getPublishedContent("potential"),
    getPublishedContent("infrastructure"),
    getPublishedPosts(3),
  ]);
  const latestYear = population[0]?.period_year;
  const latest = population.filter((item) => item.period_year === latestYear && item.statistic_type === "gender");
  const villageLevel = latest.filter((item) => item.hamlet_id === null);
  const populationBase = villageLevel.length > 0 ? villageLevel : latest.filter((item) => item.hamlet_id !== null);
  const male = populationBase.filter((item) => item.category.toLowerCase().includes("laki")).reduce((sum, item) => sum + item.total, 0);
  const female = populationBase.filter((item) => item.category.toLowerCase().includes("perempuan")).reduce((sum, item) => sum + item.total, 0);
  const total = male + female;
  const heroStyle = settings?.hero_image_url ? { backgroundImage: `url(${settings.hero_image_url})` } : undefined;

  return (
    <main>
      <section className={`hero ${settings?.hero_image_url ? "with-image" : ""}`} style={heroStyle}>
          <div className="hero-content hero-center">
            {settings?.logo_url ? (
              <img className="hero-logo" src={settings.logo_url} alt={`Logo ${settings.village_name}`} />
            ) : null}
            <p className="eyebrow light">Website Resmi Pemerintah Desa</p>
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold my-1"><TypedHero fallback={settings?.village_name || "Website Desa Belum Dikonfigurasi"} /></p>
            {settings?.district ? (
              <p className="hero-tagline">Kecamatan {settings.district}, {settings.regency}</p>
            ) : null}
            <p className="hero-copy mb-2">{settings?.welcome_message || "Admin belum memublikasikan identitas dan sambutan desa."}</p>
            <div className="button-row">
              <Link className="button light" href="/profil">Lihat Profil</Link>
              <Link className="button ghost" href="/pelayanan">Pelayanan Desa</Link>
            </div>
        </div>
        <div className="shortcut-bar">
          <div className="container">
            <div className="shortcut-grid">
              {shortcuts.map((s) => {
                const Icon = s.icon;
                return (
                  <Link key={s.href} href={s.href} className="shortcut-item">
                    <Icon size={28} className="shortcut-icon" />
                    <span className="shortcut-label">{s.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <div className="container stats-grid text-center lg:text-left">
        <div className="stat-card"><strong>{total || "0"}</strong><span>Jumlah Penduduk {latestYear ? `(${latestYear})` : ""}</span></div>
        <div className="stat-card"><strong>{male || "0"}</strong><span>Laki-laki</span></div>
        <div className="stat-card"><strong>{female || "0"}</strong><span>Perempuan</span></div>
        <div className="stat-card"><strong>{hamlets.length}</strong><span>Dusun</span></div>
      </div>
      <section className="section mt-5" style={{ paddingTop: 0 }}>
        <NewsTicker items={posts.map(p => ({ text: p.title, href: `/berita/${p.slug}` }))} />
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-heading"><p className="eyebrow">Potensi Desa</p><h2>Potensi yang dapat dikembangkan</h2></div>
          {potentials.length === 0 ? <EmptyState title="Belum ada potensi yang dipublikasikan" /> : <div className="card-grid">{potentials.slice(0, 3).map((item) => <article className="content-card" key={item.id}>{item.cover_image_url ? <img src={item.cover_image_url} alt={item.title} /> : <div className="image-placeholder">Belum ada gambar</div>}<div className="content-card-body"><span className="tag">{item.category}</span><h2>{item.title}</h2><p>{item.summary}</p><Link className="text-link" href={`/potensi/${item.slug}`}>Lihat detail →</Link></div></article>)}</div>}
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="section-heading"><p className="eyebrow">Infrastruktur</p><h2>Sarana dan prasarana desa</h2></div>
          {infrastructures.length === 0 ? <EmptyState title="Belum ada infrastruktur yang dipublikasikan" /> : <div className="compact-grid">{infrastructures.slice(0, 4).map((item) => <article className="simple-card" key={item.id}><span className="tag">{item.category}</span><h3>{item.title}</h3><p>{item.summary}</p><Link className="text-link" href={`/infrastruktur/${item.slug}`}>Lihat detail →</Link></article>)}</div>}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading"><p className="eyebrow">Berita</p><h2>Informasi terbaru dari desa</h2></div>
          {posts.length === 0 ? <EmptyState title="Belum ada berita yang diterbitkan" /> : <div className="card-grid">{posts.map((post) => <article className="content-card" key={post.id}>{post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} /> : <div className="image-placeholder">Belum ada gambar</div>}<div className="content-card-body"><span className="tag">{post.post_type}</span><h2>{post.title}</h2><p>{post.excerpt}</p><Link className="text-link" href={`/berita/${post.slug}`}>Baca berita →</Link></div></article>)}</div>}
        </div>
      </section>
    </main>
  );
}
