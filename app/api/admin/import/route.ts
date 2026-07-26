import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  allowedPopulationTypes,
  allowedPostStatuses,
  contentImportSheets,
  importSheetNames,
} from "@/lib/import-config";
import type { ContentSection } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type RowData = Record<string, unknown> & { __row: number };
type ImportData = {
  settings: RowData[];
  hamlets: RowData[];
  population: RowData[];
  officials: RowData[];
  content: Array<RowData & { __section: ContentSection; __sheet: string }>;
  posts: RowData[];
  gallery: RowData[];
};

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function text(value: unknown) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    const object = value as { text?: string; hyperlink?: string; result?: unknown; richText?: Array<{ text: string }> };
    if (object.hyperlink) return object.hyperlink.trim();
    if (object.text) return object.text.trim();
    if (object.richText) return object.richText.map((item) => item.text).join("").trim();
    if (object.result !== undefined) return text(object.result);
  }
  return String(value).trim();
}

function optional(value: unknown) {
  const result = text(value);
  return result || null;
}

function numberOrNull(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  let source = text(value).replace(/\s/g, "");
  if (!source) return null;
  if (source.includes(",") && source.includes(".")) {
    source = source.replace(/\./g, "").replace(",", ".");
  } else if (source.includes(",")) {
    source = source.replace(",", ".");
  }
  const result = Number(source);
  return Number.isFinite(result) ? result : null;
}

function booleanValue(value: unknown, fallback = false) {
  const source = text(value).toLowerCase();
  if (["ya", "yes", "true", "1", "y"].includes(source)) return true;
  if (["tidak", "no", "false", "0", "n"].includes(source)) return false;
  return fallback;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function dateOnly(value: unknown) {
  const source = optional(value);
  if (!source) return null;
  const parsed = new Date(source);
  if (Number.isNaN(parsed.getTime())) return source.slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}

function dateTime(value: unknown) {
  const source = optional(value);
  if (!source) return null;
  const parsed = new Date(source);
  return Number.isNaN(parsed.getTime()) ? source : parsed.toISOString();
}

function readSheet(workbook: ExcelJS.Workbook, sheetName: string): RowData[] {
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) return [];

  const headerRow = sheet.getRow(1);
  const headers = new Map<number, string>();
  headerRow.eachCell({ includeEmpty: false }, (cell, columnNumber) => {
    const header = normalizeHeader(cell.text);
    if (header) headers.set(columnNumber, header);
  });

  if (headers.size === 0) return [];

  const rows: RowData[] = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const data: RowData = { __row: rowNumber };
    let hasValue = false;

    headers.forEach((header, columnNumber) => {
      const value = row.getCell(columnNumber).value;
      if (text(value) !== "") hasValue = true;
      data[header] = value;
    });

    if (hasValue) rows.push(data);
  }
  return rows;
}

function parseWorkbook(workbook: ExcelJS.Workbook): ImportData {
  const content: ImportData["content"] = [];
  Object.entries(contentImportSheets).forEach(([sheetName, section]) => {
    readSheet(workbook, sheetName).forEach((row) => {
      content.push({ ...row, __section: section, __sheet: sheetName });
    });
  });

  return {
    settings: readSheet(workbook, importSheetNames.settings),
    hamlets: readSheet(workbook, importSheetNames.hamlets),
    population: readSheet(workbook, importSheetNames.population),
    officials: readSheet(workbook, importSheetNames.officials),
    content,
    posts: readSheet(workbook, importSheetNames.posts),
    gallery: readSheet(workbook, importSheetNames.gallery),
  };
}

function required(row: RowData, header: string, sheet: string, errors: string[]) {
  const result = text(row[header]);
  if (!result) errors.push(`${sheet} baris ${row.__row}: kolom “${header}” wajib diisi.`);
  return result;
}

function validate(data: ImportData) {
  const errors: string[] = [];
  const knownHamletSlugs = new Set<string>();

  data.hamlets.forEach((row) => {
    const name = required(row, "nama dusun", "Dusun", errors);
    const slug = slugify(text(row.slug) || name);
    if (slug) {
      if (knownHamletSlugs.has(slug)) errors.push(`Dusun baris ${row.__row}: slug “${slug}” duplikat dalam berkas.`);
      knownHamletSlugs.add(slug);
    }
    const total = numberOrNull(row["jumlah penduduk"]);
    if (text(row["jumlah penduduk"]) && total === null) errors.push(`Dusun baris ${row.__row}: jumlah penduduk harus berupa angka.`);
  });

  data.population.forEach((row) => {
    const type = required(row, "jenis statistik", "Penduduk", errors);
    required(row, "kategori", "Penduduk", errors);
    const total = numberOrNull(row.jumlah);
    const year = numberOrNull(row.tahun);
    if (!allowedPopulationTypes.includes(type as (typeof allowedPopulationTypes)[number])) {
      errors.push(`Penduduk baris ${row.__row}: jenis statistik harus gender, education, atau marital_status.`);
    }
    if (total === null || total < 0) errors.push(`Penduduk baris ${row.__row}: jumlah harus berupa angka nol atau lebih.`);
    if (year === null || year < 1900 || year > 2200) errors.push(`Penduduk baris ${row.__row}: tahun tidak valid.`);
  });

  data.officials.forEach((row) => {
    required(row, "nama", "Perangkat", errors);
    required(row, "jabatan", "Perangkat", errors);
  });

  const contentSlugs = new Set<string>();
  data.content.forEach((row) => {
    required(row, "kategori", row.__sheet, errors);
    const title = required(row, "judul", row.__sheet, errors);
    const slug = slugify(text(row.slug) || title);
    const key = `${row.__section}:${slug}`;
    if (slug && contentSlugs.has(key)) errors.push(`${row.__sheet} baris ${row.__row}: slug “${slug}” duplikat.`);
    contentSlugs.add(key);
    const quantity = numberOrNull(row["jumlah atau ukuran"]);
    if (text(row["jumlah atau ukuran"]) && quantity === null) errors.push(`${row.__sheet} baris ${row.__row}: jumlah atau ukuran harus berupa angka.`);
  });

  const postSlugs = new Set<string>();
  data.posts.forEach((row) => {
    const title = required(row, "judul", "Berita", errors);
    const status = required(row, "status", "Berita", errors).toLowerCase();
    if (!allowedPostStatuses.includes(status as (typeof allowedPostStatuses)[number])) {
      errors.push(`Berita baris ${row.__row}: status harus draft, published, atau archived.`);
    }
    const slug = slugify(text(row.slug) || title);
    if (slug && postSlugs.has(slug)) errors.push(`Berita baris ${row.__row}: slug “${slug}” duplikat.`);
    postSlugs.add(slug);
  });

  data.gallery.forEach((row) => {
    required(row, "judul", "Galeri", errors);
    required(row, "url gambar", "Galeri", errors);
  });

  return errors;
}

function validateHamletReferences(data: ImportData, knownHamlets: Set<string>) {
  const errors: string[] = [];
  data.population.forEach((row) => {
    const slug = slugify(text(row["slug dusun"]));
    if (slug && !knownHamlets.has(slug)) {
      errors.push(`Penduduk baris ${row.__row}: slug dusun “${slug}” tidak ditemukan pada database maupun sheet Dusun.`);
    }
  });
  data.content.forEach((row) => {
    const slug = slugify(text(row["slug dusun"]));
    if (slug && !knownHamlets.has(slug)) {
      errors.push(`${row.__sheet} baris ${row.__row}: slug dusun “${slug}” tidak ditemukan pada database maupun sheet Dusun.`);
    }
  });
  return errors;
}

async function getActiveAdmin(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  return profile ? user : null;
}

async function importSettings(supabase: SupabaseClient, rows: RowData[]) {
  if (rows.length === 0) return 0;
  const row = rows[0];
  const payload = {
    id: 1,
    village_name: optional(row["nama desa"]),
    district: optional(row.kecamatan),
    regency: optional(row["kabupaten atau kota"]),
    province: optional(row.provinsi),
    postal_code: optional(row["kode pos"]),
    address: optional(row.alamat),
    phone: optional(row.telepon),
    email: optional(row.email),
    village_head_name: optional(row["nama kepala desa"]),
    welcome_message: optional(row["sambutan singkat"]),
    history: optional(row.sejarah),
    vision: optional(row.visi),
    mission: optional(row.misi),
    logo_url: optional(row["url logo"]),
    hero_image_url: optional(row["url gambar utama"]),
    office_maps_url: optional(row["url google maps kantor"]),
    facebook_url: optional(row.facebook),
    instagram_url: optional(row.instagram),
    youtube_url: optional(row.youtube),
    is_published: booleanValue(row.publikasi),
  };
  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) throw new Error(`Profil Desa: ${error.message}`);
  return 1;
}

async function importHamlets(supabase: SupabaseClient, rows: RowData[]) {
  if (rows.length === 0) return 0;
  const payload = rows.map((row) => {
    const name = text(row["nama dusun"]);
    return {
      name,
      slug: slugify(text(row.slug) || name),
      head_name: optional(row["nama kepala dusun"]),
      description: optional(row.deskripsi),
      population_total: numberOrNull(row["jumlah penduduk"]),
      area_size: numberOrNull(row["luas wilayah"]),
      image_url: optional(row["url gambar"]),
      maps_url: optional(row["url google maps"]),
      display_order: numberOrNull(row.urutan) ?? 0,
      is_published: booleanValue(row.publikasi),
    };
  });
  const { error } = await supabase.from("hamlets").upsert(payload, { onConflict: "slug" });
  if (error) throw new Error(`Dusun: ${error.message}`);
  return payload.length;
}

async function hamletMap(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("hamlets").select("id, slug");
  if (error) throw new Error(`Membaca dusun: ${error.message}`);
  return new Map((data ?? []).map((item) => [item.slug, item.id]));
}

async function importPopulation(supabase: SupabaseClient, rows: RowData[], hamlets: Map<string, string>) {
  if (rows.length === 0) return 0;
  const { data: existing, error } = await supabase
    .from("population_statistics")
    .select("id, hamlet_id, statistic_type, category, period_year");
  if (error) throw new Error(`Data Penduduk: ${error.message}`);

  const key = (hamletId: string | null, type: string, category: string, year: number) =>
    `${hamletId ?? "desa"}|${type}|${category.toLowerCase()}|${year}`;
  const existingMap = new Map((existing ?? []).map((item) => [key(item.hamlet_id, item.statistic_type, item.category, item.period_year), item.id]));
  const inserts: Record<string, unknown>[] = [];
  let count = 0;

  for (const row of rows) {
    const slug = slugify(text(row["slug dusun"]));
    const hamletId = slug ? hamlets.get(slug) ?? null : null;
    if (slug && !hamletId) throw new Error(`Penduduk baris ${row.__row}: dusun dengan slug “${slug}” tidak ditemukan.`);
    const type = text(row["jenis statistik"]);
    const category = text(row.kategori);
    const year = numberOrNull(row.tahun) ?? new Date().getFullYear();
    const payload = {
      hamlet_id: hamletId,
      statistic_type: type,
      category,
      total: numberOrNull(row.jumlah) ?? 0,
      period_year: year,
      display_order: numberOrNull(row.urutan) ?? 0,
      is_published: booleanValue(row.publikasi),
    };
    const existingId = existingMap.get(key(hamletId, type, category, year));
    if (existingId) {
      const result = await supabase.from("population_statistics").update(payload).eq("id", existingId);
      if (result.error) throw new Error(`Penduduk baris ${row.__row}: ${result.error.message}`);
    } else {
      inserts.push(payload);
    }
    count += 1;
  }

  if (inserts.length > 0) {
    const result = await supabase.from("population_statistics").insert(inserts);
    if (result.error) throw new Error(`Data Penduduk: ${result.error.message}`);
  }
  return count;
}

async function importOfficials(supabase: SupabaseClient, rows: RowData[]) {
  if (rows.length === 0) return 0;
  const { data: existing, error } = await supabase.from("officials").select("id, name, position");
  if (error) throw new Error(`Perangkat: ${error.message}`);
  const existingMap = new Map((existing ?? []).map((item) => [`${item.name.toLowerCase()}|${item.position.toLowerCase()}`, item.id]));
  const inserts: Record<string, unknown>[] = [];

  for (const row of rows) {
    const name = text(row.nama);
    const position = text(row.jabatan);
    const payload = {
      name,
      position,
      photo_url: optional(row["url foto"]),
      biography: optional(row.biografi),
      display_order: numberOrNull(row.urutan) ?? 0,
      is_published: booleanValue(row.publikasi),
    };
    const id = existingMap.get(`${name.toLowerCase()}|${position.toLowerCase()}`);
    if (id) {
      const result = await supabase.from("officials").update(payload).eq("id", id);
      if (result.error) throw new Error(`Perangkat baris ${row.__row}: ${result.error.message}`);
    } else inserts.push(payload);
  }
  if (inserts.length > 0) {
    const result = await supabase.from("officials").insert(inserts);
    if (result.error) throw new Error(`Perangkat: ${result.error.message}`);
  }
  return rows.length;
}

async function importContent(supabase: SupabaseClient, rows: ImportData["content"], hamlets: Map<string, string>) {
  if (rows.length === 0) return 0;
  const payload = rows.map((row) => {
    const title = text(row.judul);
    const hamletSlug = slugify(text(row["slug dusun"]));
    const hamletId = hamletSlug ? hamlets.get(hamletSlug) ?? null : null;
    if (hamletSlug && !hamletId) throw new Error(`${row.__sheet} baris ${row.__row}: dusun “${hamletSlug}” tidak ditemukan.`);
    return {
      section: row.__section,
      category: text(row.kategori),
      title,
      slug: slugify(text(row.slug) || title),
      summary: optional(row.ringkasan),
      description: optional(row.deskripsi),
      location_name: optional(row["nama lokasi"]),
      maps_url: optional(row["url google maps"]),
      cover_image_url: optional(row["url gambar"]),
      hamlet_id: hamletId,
      metadata: {
        condition: optional(row.kondisi),
        construction_type: optional(row["jenis konstruksi atau usaha"]),
        quantity: numberOrNull(row["jumlah atau ukuran"]),
        unit: optional(row.satuan),
        year: numberOrNull(row.tahun),
        manager_name: optional(row.pengelola),
        phone: optional(row.telepon),
        schedule: optional(row.jadwal),
      },
      display_order: numberOrNull(row.urutan) ?? 0,
      is_featured: booleanValue(row.unggulan),
      is_published: booleanValue(row.publikasi),
    };
  });
  const { error } = await supabase.from("content_items").upsert(payload, { onConflict: "section,slug" });
  if (error) throw new Error(`Konten: ${error.message}`);
  return payload.length;
}

async function importPosts(supabase: SupabaseClient, rows: RowData[]) {
  if (rows.length === 0) return 0;
  const payload = rows.map((row) => {
    const title = text(row.judul);
    const status = text(row.status).toLowerCase();
    const publishedAt = dateTime(row["tanggal publikasi"]);
    return {
      post_type: text(row["jenis publikasi"]) || "Berita",
      title,
      slug: slugify(text(row.slug) || title),
      excerpt: optional(row.ringkasan),
      content: optional(row.isi),
      cover_image_url: optional(row["url gambar"]),
      status,
      published_at: status === "published" ? publishedAt ?? new Date().toISOString() : publishedAt,
    };
  });
  const { error } = await supabase.from("posts").upsert(payload, { onConflict: "slug" });
  if (error) throw new Error(`Berita: ${error.message}`);
  return payload.length;
}

async function importGallery(supabase: SupabaseClient, rows: RowData[]) {
  if (rows.length === 0) return 0;
  const { data: existing, error } = await supabase.from("gallery_items").select("id, title, event_date");
  if (error) throw new Error(`Galeri: ${error.message}`);
  const key = (title: string, eventDate: string | null) => `${title.toLowerCase()}|${eventDate ?? ""}`;
  const existingMap = new Map((existing ?? []).map((item) => [key(item.title, item.event_date), item.id]));
  const inserts: Record<string, unknown>[] = [];

  for (const row of rows) {
    const title = text(row.judul);
    const eventDate = dateOnly(row["tanggal kegiatan"]);
    const payload = {
      title,
      description: optional(row.deskripsi),
      category: optional(row.kategori),
      image_url: text(row["url gambar"]),
      event_date: eventDate,
      display_order: numberOrNull(row.urutan) ?? 0,
      is_published: booleanValue(row.publikasi),
    };
    const id = existingMap.get(key(title, eventDate));
    if (id) {
      const result = await supabase.from("gallery_items").update(payload).eq("id", id);
      if (result.error) throw new Error(`Galeri baris ${row.__row}: ${result.error.message}`);
    } else inserts.push(payload);
  }
  if (inserts.length > 0) {
    const result = await supabase.from("gallery_items").insert(inserts);
    if (result.error) throw new Error(`Galeri: ${result.error.message}`);
  }
  return rows.length;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const admin = await getActiveAdmin(supabase);
    if (!admin) return NextResponse.json({ ok: false, message: "Sesi admin tidak valid. Silakan login kembali." }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file");
    const validateOnly = formData.get("validateOnly") === "true";

    if (!(file instanceof File)) return NextResponse.json({ ok: false, message: "Berkas Excel tidak ditemukan." }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".xlsx")) return NextResponse.json({ ok: false, message: "Format berkas harus .xlsx." }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ ok: false, message: "Ukuran berkas maksimal 5 MB." }, { status: 400 });

const workbook = new ExcelJS.Workbook();

const arrayBuffer = await file.arrayBuffer();

await workbook.xlsx.load(arrayBuffer);

if (!workbook.worksheets || workbook.worksheets.length === 0) {
  return NextResponse.json(
    {
      ok: false,
      message: "File Excel tidak memiliki worksheet yang dapat dibaca."
    },
    { status: 400 }
  );
}

const parsed = parseWorkbook(workbook);
    const currentHamlets = await hamletMap(supabase);
    const knownHamlets = new Set(currentHamlets.keys());
    parsed.hamlets.forEach((row) => {
      const name = text(row["nama dusun"]);
      const slug = slugify(text(row.slug) || name);
      if (slug) knownHamlets.add(slug);
    });
    const errors = [...validate(parsed), ...validateHamletReferences(parsed, knownHamlets)];
    const counts = {
      profil: parsed.settings.length > 0 ? 1 : 0,
      dusun: parsed.hamlets.length,
      penduduk: parsed.population.length,
      perangkat: parsed.officials.length,
      konten: parsed.content.length,
      berita: parsed.posts.length,
      galeri: parsed.gallery.length,
    };

    const totalRows = Object.values(counts).reduce((sum, count) => sum + count, 0);
    if (totalRows === 0) return NextResponse.json({ ok: false, message: "Tidak ada baris data yang dapat diproses.", counts }, { status: 400 });
    if (errors.length > 0) return NextResponse.json({ ok: false, message: `Ditemukan ${errors.length} kesalahan. Perbaiki berkas sebelum diimpor.`, counts, errors: errors.slice(0, 100) }, { status: 400 });
    if (validateOnly) return NextResponse.json({ ok: true, validateOnly: true, message: "Validasi berhasil. Berkas siap diimpor.", counts });

    const imported: Record<string, number> = {};
    imported.profil = await importSettings(supabase, parsed.settings);
    imported.dusun = await importHamlets(supabase, parsed.hamlets);
    const hamlets = await hamletMap(supabase);
    imported.penduduk = await importPopulation(supabase, parsed.population, hamlets);
    imported.perangkat = await importOfficials(supabase, parsed.officials);
    imported.konten = await importContent(supabase, parsed.content, hamlets);
    imported.berita = await importPosts(supabase, parsed.posts);
    imported.galeri = await importGallery(supabase, parsed.gallery);

    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, message: "Data Excel berhasil diimpor ke website.", counts: imported });
  } catch (error) {
    console.error("Excel import error", error);
    return NextResponse.json({
      ok: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan saat mengimpor data.",
    }, { status: 500 });
  }
}
