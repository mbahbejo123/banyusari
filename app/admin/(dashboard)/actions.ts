"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { sectionConfig } from "@/lib/config";
import type { ContentSection } from "@/lib/types";

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  const text = typeof item === "string" ? item.trim() : "";
  return text || null;
}
function numberValue(formData: FormData, key: string) {
  const text = value(formData, key);
  if (text === null) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}
function checked(formData: FormData, key: string) { return formData.get(key) === "on"; }
function slugify(input: string) { return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function requiredText(formData: FormData, key: string) {
  const text = value(formData, key);
  if (!text) throw new Error(`${key} wajib diisi.`);
  return text;
}

export async function saveSettings(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    id: 1,
    village_name: value(formData, "village_name"), district: value(formData, "district"), regency: value(formData, "regency"), province: value(formData, "province"), postal_code: value(formData, "postal_code"), address: value(formData, "address"), phone: value(formData, "phone"), email: value(formData, "email"), village_head_name: value(formData, "village_head_name"), welcome_message: value(formData, "welcome_message"), history: value(formData, "history"), vision: value(formData, "vision"), mission: value(formData, "mission"), logo_url: value(formData, "logo_url"), hero_image_url: value(formData, "hero_image_url"), office_maps_url: value(formData, "office_maps_url"), facebook_url: value(formData, "facebook_url"), instagram_url: value(formData, "instagram_url"), youtube_url: value(formData, "youtube_url"), is_published: checked(formData, "is_published"),
  };
  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/pengaturan?saved=1");
}

export async function saveHamlet(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, "id");
  const name = requiredText(formData, "name");
  const payload = { name, slug: slugify(value(formData, "slug") || name), head_name: value(formData, "head_name"), description: value(formData, "description"), population_total: numberValue(formData, "population_total"), area_size: numberValue(formData, "area_size"), image_url: value(formData, "image_url"), maps_url: value(formData, "maps_url"), display_order: numberValue(formData, "display_order") || 0, is_published: checked(formData, "is_published") };
  const result = id ? await supabase.from("hamlets").update(payload).eq("id", id) : await supabase.from("hamlets").insert(payload);
  if (result.error) throw new Error(result.error.message);
  revalidatePath("/dusun"); revalidatePath("/");
  redirect("/admin/dusun");
}
export async function deleteHamlet(id: string) { const { supabase } = await requireAdmin(); const { error } = await supabase.from("hamlets").delete().eq("id", id); if (error) throw new Error(error.message); revalidatePath("/dusun"); redirect("/admin/dusun"); }

export async function savePopulation(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, "id");
  const payload = { hamlet_id: value(formData, "hamlet_id"), statistic_type: requiredText(formData, "statistic_type"), category: requiredText(formData, "category"), total: numberValue(formData, "total") || 0, period_year: numberValue(formData, "period_year") || new Date().getFullYear(), display_order: numberValue(formData, "display_order") || 0, is_published: checked(formData, "is_published") };
  const result = id ? await supabase.from("population_statistics").update(payload).eq("id", id) : await supabase.from("population_statistics").insert(payload);
  if (result.error) throw new Error(result.error.message);
  revalidatePath("/penduduk"); revalidatePath("/"); redirect("/admin/penduduk");
}
export async function deletePopulation(id: string) { const { supabase } = await requireAdmin(); const { error } = await supabase.from("population_statistics").delete().eq("id", id); if (error) throw new Error(error.message); revalidatePath("/penduduk"); redirect("/admin/penduduk"); }

export async function saveOfficial(formData: FormData) {
  const { supabase } = await requireAdmin(); const id = value(formData, "id");
  const payload = { name: requiredText(formData, "name"), position: requiredText(formData, "position"), photo_url: value(formData, "photo_url"), biography: value(formData, "biography"), display_order: numberValue(formData, "display_order") || 0, is_published: checked(formData, "is_published") };
  const result = id ? await supabase.from("officials").update(payload).eq("id", id) : await supabase.from("officials").insert(payload);
  if (result.error) throw new Error(result.error.message); revalidatePath("/profil"); redirect("/admin/perangkat");
}
export async function deleteOfficial(id: string) { const { supabase } = await requireAdmin(); const { error } = await supabase.from("officials").delete().eq("id", id); if (error) throw new Error(error.message); revalidatePath("/profil"); redirect("/admin/perangkat"); }

export async function saveContent(section: ContentSection, formData: FormData) {
  if (!sectionConfig[section]) throw new Error("Bagian konten tidak valid.");
  const { supabase } = await requireAdmin(); const id = value(formData, "id"); const title = requiredText(formData, "title");
  const metadata = { condition: value(formData, "condition"), construction_type: value(formData, "construction_type"), quantity: numberValue(formData, "quantity"), unit: value(formData, "unit"), year: numberValue(formData, "year"), manager_name: value(formData, "manager_name"), phone: value(formData, "phone"), schedule: value(formData, "schedule") };
  const payload = { section, category: requiredText(formData, "category"), title, slug: slugify(value(formData, "slug") || title), summary: value(formData, "summary"), description: value(formData, "description"), location_name: value(formData, "location_name"), maps_url: value(formData, "maps_url"), cover_image_url: value(formData, "cover_image_url"), hamlet_id: value(formData, "hamlet_id"), metadata, display_order: numberValue(formData, "display_order") || 0, is_featured: checked(formData, "is_featured"), is_published: checked(formData, "is_published") };
  const result = id ? await supabase.from("content_items").update(payload).eq("id", id) : await supabase.from("content_items").insert(payload);
  if (result.error) throw new Error(result.error.message); revalidatePath(sectionConfig[section].publicPath); revalidatePath("/"); redirect(`/admin/konten/${section}`);
}
export async function deleteContent(section: ContentSection, id: string) { const { supabase } = await requireAdmin(); const { error } = await supabase.from("content_items").delete().eq("id", id).eq("section", section); if (error) throw new Error(error.message); revalidatePath(sectionConfig[section].publicPath); redirect(`/admin/konten/${section}`); }

export async function savePost(formData: FormData) {
  const { supabase } = await requireAdmin(); const id = value(formData, "id"); const title = requiredText(formData, "title"); const status = requiredText(formData, "status");
  const payload = { post_type: requiredText(formData, "post_type"), title, slug: slugify(value(formData, "slug") || title), excerpt: value(formData, "excerpt"), content: value(formData, "content"), cover_image_url: value(formData, "cover_image_url"), status, published_at: status === "published" ? (value(formData, "published_at") || new Date().toISOString()) : value(formData, "published_at") };
  const result = id ? await supabase.from("posts").update(payload).eq("id", id) : await supabase.from("posts").insert(payload);
  if (result.error) throw new Error(result.error.message); revalidatePath("/berita"); revalidatePath("/"); redirect("/admin/berita");
}
export async function deletePost(id: string) { const { supabase } = await requireAdmin(); const { error } = await supabase.from("posts").delete().eq("id", id); if (error) throw new Error(error.message); revalidatePath("/berita"); redirect("/admin/berita"); }

export async function saveGallery(formData: FormData) {
  const { supabase } = await requireAdmin(); const id = value(formData, "id");
  const payload = { title: requiredText(formData, "title"), description: value(formData, "description"), category: value(formData, "category"), image_url: requiredText(formData, "image_url"), event_date: value(formData, "event_date"), display_order: numberValue(formData, "display_order") || 0, is_published: checked(formData, "is_published") };
  const result = id ? await supabase.from("gallery_items").update(payload).eq("id", id) : await supabase.from("gallery_items").insert(payload);
  if (result.error) throw new Error(result.error.message); revalidatePath("/galeri"); redirect("/admin/galeri");
}
export async function deleteGallery(id: string) { const { supabase } = await requireAdmin(); const { error } = await supabase.from("gallery_items").delete().eq("id", id); if (error) throw new Error(error.message); revalidatePath("/galeri"); redirect("/admin/galeri"); }
