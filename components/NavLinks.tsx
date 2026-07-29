"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  IconHome, IconUser, IconLeaf, IconBuildingBridge, IconBuildingStore,
  IconClipboardList, IconHome2, IconNews, IconPhoto, IconPhone, IconChevronDown,
} from "@tabler/icons-react";

type NavChild = { href: string; label: string };
type NavItem = { href?: string; label: string; icon: React.ReactNode; children?: NavChild[] };

const iconSize = 18;

const navigation: NavItem[] = [
  { href: "/", label: "Beranda", icon: <IconHome size={iconSize} /> },
  {
    label: "Profil Desa", icon: <IconUser size={iconSize} />,
    children: [
      { href: "/profil", label: "Profil Desa" },
      { href: "/dusun", label: "Dusun" },
      { href: "/penduduk", label: "Data Penduduk" },
    ],
  },
  {
    label: "Potensi", icon: <IconLeaf size={iconSize} />,
    children: [
      { href: "/potensi?kategori=Mata%20Air", label: "Mata Air" },
      { href: "/potensi?kategori=Persawahan", label: "Persawahan" },
      { href: "/potensi?kategori=Pertanian", label: "Pertanian" },
      { href: "/potensi?kategori=Perkebunan", label: "Perkebunan" },
      { href: "/potensi?kategori=Peternakan", label: "Peternakan" },
      { href: "/potensi?kategori=Pariwisata", label: "Pariwisata" },
      { href: "/potensi?kategori=Produk%20Unggulan", label: "Produk Unggulan" },
      { href: "/potensi?kategori=Sumber%20Daya%20Alam", label: "Sumber Daya Alam" },
    ],
  },
  {
    label: "Infrastruktur", icon: <IconBuildingBridge size={iconSize} />,
    children: [
      { href: "/infrastruktur?kategori=Jalan", label: "Jalan" },
      { href: "/infrastruktur?kategori=Jembatan", label: "Jembatan" },
      { href: "/infrastruktur?kategori=Irigasi", label: "Irigasi" },
      { href: "/infrastruktur?kategori=Drainase", label: "Drainase" },
      { href: "/infrastruktur?kategori=Air%20Bersih", label: "Air Bersih" },
      { href: "/infrastruktur?kategori=Bangunan%20Publik", label: "Bangunan Publik" },
      { href: "/infrastruktur?kategori=Pendidikan", label: "Pendidikan" },
      { href: "/infrastruktur?kategori=Kesehatan", label: "Kesehatan" },
      { href: "/infrastruktur?kategori=Tempat%20Ibadah", label: "Tempat Ibadah" },
      { href: "/infrastruktur?kategori=Penerangan%20Jalan", label: "Penerangan Jalan" },
      { href: "/infrastruktur?kategori=Telekomunikasi", label: "Telekomunikasi" },
    ],
  },
  {
    label: "Usaha & Lembaga", icon: <IconBuildingStore size={iconSize} />,
    children: [
      { href: "/kelembagaan?kategori=Kelompok%20Tani", label: "Kelompok Tani" },
      { href: "/usaha?kategori=Kelompok%20Usaha", label: "Kelompok Usaha" },
      { href: "/usaha?kategori=Usaha%20Binaan%20PKK", label: "Usaha Binaan PKK" },
      { href: "/usaha?kategori=Koperasi", label: "Koperasi" },
      { href: "/usaha?kategori=UMKM", label: "UMKM" },
      { href: "/usaha?kategori=BUMDes", label: "BUMDes" },
      { href: "/kelembagaan?kategori=RT%2FRW", label: "RT/RW" },
      { href: "/kelembagaan?kategori=Kepala%20Dusun", label: "Kepala Dusun" },
      { href: "/kelembagaan?kategori=PKK", label: "PKK" },
      { href: "/kelembagaan?kategori=Karang%20Taruna", label: "Karang Taruna" },
      { href: "/kelembagaan?kategori=BPD", label: "BPD" },
    ],
  },
  {
    label: "Pelayanan", icon: <IconClipboardList size={iconSize} />,
    children: [
      { href: "/pelayanan?kategori=Posyandu%20Balita", label: "Posyandu Balita" },
      { href: "/pelayanan?kategori=Posyandu%20Lansia", label: "Posyandu Lansia" },
      { href: "/pelayanan?kategori=Posyandu%20Remaja", label: "Posyandu Remaja" },
      { href: "/pelayanan?kategori=Poskesdes", label: "Poskesdes" },
      { href: "/pelayanan?kategori=Puskesmas%20Pembantu", label: "Puskesmas Pembantu" },
      { href: "/pelayanan?kategori=Administrasi%20Desa", label: "Administrasi Desa" },
      { href: "/pelayanan?kategori=Pelayanan%20Sosial", label: "Pelayanan Sosial" },
    ],
  },
  {
    label: "Perumahan", icon: <IconHome2 size={iconSize} />,
    children: [
      { href: "/perumahan?kategori=Rumah%20Permanen", label: "Rumah Permanen" },
      { href: "/perumahan?kategori=Rumah%20Semi%20Permanen", label: "Rumah Semi Permanen" },
      { href: "/perumahan?kategori=Rumah%20Tidak%20Permanen", label: "Rumah Tidak Permanen" },
      { href: "/perumahan?kategori=Rumah%20Layak%20Huni", label: "Rumah Layak Huni" },
      { href: "/perumahan?kategori=Rumah%20Tidak%20Layak%20Huni", label: "Rumah Tidak Layak Huni" },
      { href: "/perumahan?kategori=Sanitasi", label: "Sanitasi" },
      { href: "/perumahan?kategori=Akses%20Air%20Bersih", label: "Akses Air Bersih" },
    ],
  },
  { href: "/berita", label: "Berita", icon: <IconNews size={iconSize} /> },
  { href: "/galeri", label: "Galeri", icon: <IconPhoto size={iconSize} /> },
  { href: "/kontak", label: "Kontak", icon: <IconPhone size={iconSize} /> },
];

function childActive(pathname: string, kategori: string | null, href: string): boolean {
  const [childPath, qs] = href.split("?");
  if (pathname !== childPath) return false;
  if (!qs) return true;
  return new URLSearchParams(qs).get("kategori") === kategori;
}

function isActive(pathname: string, kategori: string | null, item: NavItem): boolean {
  if (item.href && pathname === item.href) return true;
  if (item.children) return item.children.some((c) => childActive(pathname, kategori, c.href));
  return false;
}

export function DesktopNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const kategori = searchParams.get("kategori");
  return (
    <nav className="desktop-nav">
      {navigation.map((item, i) => {
        const active = isActive(pathname, kategori, item);
        if (item.children) {
          return (
            <div key={i} className={`nav-parent${active ? " active" : ""}`}>
              <span className="nav-trigger">
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                <IconChevronDown size={14} className="nav-chevron" />
              </span>
              <div className="nav-dropdown">
                {item.children.map((child, j) => (
                  <Link key={j} href={child.href} className={`nav-child${childActive(pathname, kategori, child.href) ? " active" : ""}`} style={{ fontFamily: "var(--font-inter)" }}>
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        }
        return (
          <Link key={i} href={item.href!} className={active ? "active" : ""}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const kategori = searchParams.get("kategori");
  return (
    <nav className="mobile-nav-drawer">
      {navigation.map((item, i) => {
        const active = isActive(pathname, kategori, item);
        if (item.children) {
          return <MobileGroup key={i} item={item} pathname={pathname} kategori={kategori} active={active} />;
        }
        return (
          <Link key={i} href={item.href!} className={`mobile-link${active ? " active" : ""}`} style={{ fontFamily: "var(--font-inter)" }}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileGroup({ item, pathname, kategori, active }: { item: NavItem; pathname: string; kategori: string | null; active: boolean }) {
  const [open, setOpen] = useState(active);
  return (
    <div className={`mobile-group${open ? " open" : ""}`}>
      <button className="mobile-group-trigger" onClick={() => setOpen(!open)}>
        <span className="nav-icon">{item.icon}</span>
        {item.label}
        <IconChevronDown size={14} className={`nav-chevron${open ? " open" : ""}`} />
      </button>
      {open && (
        <div className="mobile-group-children">
          {item.children!.map((child, j) => (
            <Link key={j} href={child.href} className={`mobile-link child${childActive(pathname, kategori, child.href) ? " active" : ""}`}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
