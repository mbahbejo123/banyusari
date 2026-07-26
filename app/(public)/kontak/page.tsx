import EmptyState from "@/components/EmptyState";
import PageHero from "@/components/PageHero";
import { getPublicSettings } from "@/lib/data";

export default async function ContactPage() {
  const settings = await getPublicSettings();
  return <main><PageHero eyebrow="Kontak" title="Hubungi Pemerintah Desa" description="Informasi alamat, telepon, surel, dan lokasi kantor desa." /><section className="section"><div className="container">{!settings ? <EmptyState title="Informasi kontak belum dipublikasikan" /> : <div className="detail-layout"><article className="detail-panel"><h2>Alamat Kantor</h2><p>{settings.address || "Belum diisi"}</p><p>{[settings.district, settings.regency, settings.province, settings.postal_code].filter(Boolean).join(", ")}</p><h2>Kontak</h2><p>Telepon: {settings.phone || "Belum diisi"}</p><p>Surel: {settings.email || "Belum diisi"}</p></article><aside className="detail-sidebar"><h2>Lokasi</h2>{settings.office_maps_url ? <a className="button primary full" href={settings.office_maps_url} target="_blank" rel="noreferrer">Buka Google Maps</a> : <p className="muted">Tautan Google Maps belum diisi.</p>}</aside></div>}</div></section></main>;
}
