import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Portal Desa", template: "%s | Portal Desa" },
  description: "Website resmi pemerintah desa yang dikelola melalui dashboard admin.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
