import type { ContentSection } from "@/lib/types";

export const importSheetNames = {
  settings: "Profil Desa",
  hamlets: "Dusun",
  population: "Penduduk",
  officials: "Perangkat",
  posts: "Berita",
  gallery: "Galeri",
} as const;

export const contentImportSheets: Record<string, ContentSection> = {
  Potensi: "potential",
  Infrastruktur: "infrastructure",
  Usaha: "business",
  Kelembagaan: "institution",
  Pelayanan: "service",
  Perumahan: "housing",
};

export const allowedPopulationTypes = [
  "gender",
  "education",
  "marital_status",
  "age",
] as const;

export const allowedPostStatuses = ["draft", "published", "archived"] as const;

export const allowedPostTypes = ["Berita", "Pengumuman", "Agenda"] as const;
