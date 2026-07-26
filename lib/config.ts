import type { ContentSection } from "@/lib/types";

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
      "Telekomunikasi",
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
    categories: ["PKK", "BPD", "Karang Taruna", "LPM", "RT/RW", "Kelompok Tani", "KWT", "Linmas"],
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

export const populationTypeLabels = {
  gender: "Jenis Kelamin",
  education: "Jenjang Pendidikan",
  marital_status: "Status Perkawinan",
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
};
