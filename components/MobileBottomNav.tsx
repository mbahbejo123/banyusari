"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconMap, IconPhoto, IconPhone, IconLogin } from "@tabler/icons-react";

const items = [
  { href: "/", label: "Beranda", icon: IconHome },
  { href: "/dusun", label: "Dusun", icon: IconMap },
  { href: "/galeri", label: "Galeri", icon: IconPhoto },
  { href: "/kontak", label: "Kontak", icon: IconPhone },
  { href: "/admin/login", label: "Login", icon: IconLogin },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item${active ? " active" : ""}`}
          >
            <Icon size={20} />
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
