import Link from "next/link";
export default function NotFound() { return <main className="section"><div className="container empty-state"><p className="eyebrow">404</p><h1>Halaman tidak ditemukan</h1><p>Data mungkin belum dipublikasikan atau alamat telah berubah.</p><Link className="button primary" href="/">Kembali ke beranda</Link></div></main>; }
