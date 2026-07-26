import { createClient } from "@/lib/supabase/server";
import type {
  ContentItem,
  ContentSection,
  GalleryItem,
  Hamlet,
  Official,
  PopulationStatistic,
  Post,
  SiteSettings,
} from "@/lib/types";

export async function getPublicSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .eq("is_published", true)
    .maybeSingle();
  return data as SiteSettings | null;
}

export async function getPublishedHamlets(): Promise<Hamlet[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hamlets")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("name");
  return (data ?? []) as Hamlet[];
}

export async function getPublishedOfficials(): Promise<Official[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("officials")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("position");
  return (data ?? []) as Official[];
}

export async function getPublishedPopulation(): Promise<PopulationStatistic[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("population_statistics")
    .select("*, hamlets(name)")
    .eq("is_published", true)
    .order("period_year", { ascending: false })
    .order("display_order");
  return (data ?? []) as PopulationStatistic[];
}

export async function getPublishedContent(section: ContentSection): Promise<ContentItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_items")
    .select("*, hamlets(name)")
    .eq("section", section)
    .eq("is_published", true)
    .order("display_order")
    .order("created_at", { ascending: false });
  return (data ?? []) as ContentItem[];
}

export async function getPublishedContentBySlug(
  section: ContentSection,
  slug: string
): Promise<ContentItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_items")
    .select("*, hamlets(name)")
    .eq("section", section)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data as ContentItem | null;
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data ?? []) as Post[];
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data as Post | null;
}

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("event_date", { ascending: false });
  return (data ?? []) as GalleryItem[];
}
