"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { sectionConfig, usahaLembagaNav } from "@/lib/config";
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
    children: sectionConfig.potential.categories.map((cat) => ({
      href: `/potensi?kategori=${encodeURIComponent(cat)}`,
      label: cat,
    })),
  },
  {
    label: "Infrastruktur", icon: <IconBuildingBridge size={iconSize} />,
    children: sectionConfig.infrastructure.categories.map((cat) => ({
      href: `/infrastruktur?kategori=${encodeURIComponent(cat)}`,
      label: cat,
    })),
  },
  {
    label: "Usaha & Lembaga", icon: <IconBuildingStore size={iconSize} />,
    children: usahaLembagaNav.map((item) => ({
      href: `${sectionConfig[item.section].publicPath}?kategori=${encodeURIComponent(item.category)}`,
      label: item.label || item.category,
    })),
  },
  {
    label: "Pelayanan", icon: <IconClipboardList size={iconSize} />,
    children: sectionConfig.service.categories.map((cat) => ({
      href: `/pelayanan?kategori=${encodeURIComponent(cat)}`,
      label: cat,
    })),
  },
  {
    label: "Perumahan", icon: <IconHome2 size={iconSize} />,
    children: sectionConfig.housing.categories.map((cat) => ({
      href: `/perumahan?kategori=${encodeURIComponent(cat)}`,
      label: cat,
    })),
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
