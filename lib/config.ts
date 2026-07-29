import type { ContentSection } from "@/lib/types";

export type ContentFieldRule = {
  measurements?: true;
  galleryLabel?: string;
  galleryFolder?: string;
  statusAktif?: true;
};

export const sectionConfig: Record<
  ContentSection,
  {
    label: string;
    publicPath: string;
    description: string;
    categories: string[];
  }
> = {
  potential: {
    label: "Potensi Desa",
    publicPath: "/potensi",
    description: "Mata air, persawahan, pertanian, wisata, dan potensi unggulan.",
    categories: [
      "Mata Air",
      "Persawahan",
      "Pertanian",
      "Perkebunan",
      "Peternakan",
      "Pariwisata",
      "Produk Unggulan",
      "Sumber Daya Alam",
    ],
  },
  infrastructure: {
    label: "Infrastruktur",
    publicPath: "/infrastruktur",
    description: "Jalan, irigasi, jembatan, bangunan, air bersih, dan fasilitas umum.",
    categories: [
      "Jalan",
      "Jembatan",
      "Irigasi",
      "Drainase",
      "Air Bersih",
      "Bangunan Publik",
      "Pendidikan",
      "Kesehatan",
      "Tempat Ibadah",
      "Penerangan Jalan",
    ],
  },
  business: {
    label: "BUMDes dan Usaha",
    publicPath: "/usaha",
    description: "BUMDes, UMKM, koperasi, usaha binaan PKK, dan kelompok usaha.",
    categories: ["BUMDes", "UMKM", "Koperasi", "Kelompok Usaha", "Usaha Binaan PKK"],
  },
  institution: {
    label: "Kelembagaan",
    publicPath: "/kelembagaan",
    description: "PKK, BPD, Karang Taruna, LPM, kelompok tani, dan kelembagaan lain.",
    categories: ["PKK", "BPD", "Karang Taruna", "LPM", "RT/RW", "Kelompok Tani", "KWT", "Linmas", "Kepala Dusun"],
  },
  service: {
    label: "Pelayanan",
    publicPath: "/pelayanan",
    description: "Posyandu, kesehatan, administrasi, sosial, dan pelayanan masyarakat.",
    categories: [
      "Posyandu Balita",
      "Posyandu Lansia",
      "Posyandu Remaja",
      "Poskesdes",
      "Puskesmas Pembantu",
      "Administrasi Desa",
      "Pelayanan Sosial",
    ],
  },
  housing: {
    label: "Perumahan",
    publicPath: "/perumahan",
    description: "Kondisi rumah, rumah tidak layak huni, sanitasi, dan air bersih.",
    categories: [
      "Rumah Permanen",
      "Rumah Semi Permanen",
      "Rumah Tidak Permanen",
      "Rumah Layak Huni",
      "Rumah Tidak Layak Huni",
      "Sanitasi",
      "Akses Air Bersih",
    ],
  },
};

type FieldRuleKey = {
  [S in keyof typeof sectionConfig]: `${S & string}:${(typeof sectionConfig)[S]["categories"][number]}`;
}[keyof typeof sectionConfig];

export const contentFieldRules: Partial<Record<FieldRuleKey, ContentFieldRule>> = {
  "infrastructure:Jalan": { measurements: true },
  "infrastructure:Irigasi": { measurements: true },
  "housing:Rumah Tidak Layak Huni": { galleryLabel: "Foto Rumah", galleryFolder: "rtlh" },
  "institution:PKK": { galleryLabel: "Foto Kegiatan PKK", galleryFolder: "pkk", statusAktif: true },
  "service:Posyandu Balita": { galleryLabel: "Foto Kegiatan Posyandu", galleryFolder: "posyandu", statusAktif: true },
  "service:Posyandu Lansia": { galleryLabel: "Foto Kegiatan Posyandu", galleryFolder: "posyandu", statusAktif: true },
  "service:Posyandu Remaja": { galleryLabel: "Foto Kegiatan Posyandu", galleryFolder: "posyandu", statusAktif: true },
};

export const usahaLembagaNav: Array<{ section: "business" | "institution"; category: string; label?: string }> = [
  { section: "institution", category: "Kelompok Tani" },
  { section: "business", category: "Kelompok Usaha" },
  { section: "business", category: "Usaha Binaan PKK" },
  { section: "business", category: "Koperasi" },
  { section: "business", category: "UMKM" },
  { section: "business", category: "BUMDes" },
  { section: "institution", category: "RT/RW" },
  { section: "institution", category: "Kepala Dusun" },
  { section: "institution", category: "PKK", label: "PPK" },
  { section: "institution", category: "Karang Taruna" },
  { section: "institution", category: "BPD" },
];

export const populationTypeLabels = {
  gender: "Jenis Kelamin",
  education: "Jenjang Pendidikan",
  marital_status: "Status Perkawinan",
  age: "Klasifikasi Umur",
};

export const populationCategories = {
  gender: ["Laki-laki", "Perempuan"],
  education: [
    "Tidak atau Belum Sekolah",
    "Belum Tamat SD",
    "SD atau Sederajat",
    "SMP atau Sederajat",
    "SMA atau Sederajat",
    "Diploma",
    "Sarjana",
    "Pascasarjana",
  ],
  marital_status: ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"],
  age: [
    "0-5 Tahun",
    "6-12 Tahun",
    "13-17 Tahun",
    "18-25 Tahun",
    "26-35 Tahun",
    "36-45 Tahun",
    "46-55 Tahun",
    "56-65 Tahun",
    "65+ Tahun",
  ],
};
