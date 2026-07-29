export type ContentSection =
  | "potential"
  | "infrastructure"
  | "business"
  | "institution"
  | "service"
  | "housing";

export type SiteSettings = {
  id: number;
  village_name: string | null;
  district: string | null;
  regency: string | null;
  province: string | null;
  postal_code: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  village_head_name: string | null;
  welcome_message: string | null;
  history: string | null;
  vision: string | null;
  mission: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  office_maps_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  is_published: boolean;
};

export type Hamlet = {
  id: string;
  name: string;
  slug: string;
  head_name: string | null;
  description: string | null;
  population_total: number | null;
  area_size: number | null;
  image_url: string | null;
  maps_url: string | null;
  display_order: number;
  is_published: boolean;
};

export type PopulationStatistic = {
  id: string;
  hamlet_id: string | null;
  statistic_type: "gender" | "education" | "marital_status" | "age";
  category: string;
  total: number;
  period_year: number;
  display_order: number;
  is_published: boolean;
  hamlets?: { name: string } | null;
};

export type Official = {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  biography: string | null;
  display_order: number;
  is_published: boolean;
};

export type ContentItem = {
  id: string;
  section: ContentSection;
  category: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  location_name: string | null;
  maps_url: string | null;
  cover_image_url: string | null;
  hamlet_id: string | null;
  metadata: Record<string, string | number | null>;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  hamlets?: { name: string } | null;
};

export type Post = {
  id: string;
  post_type: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  event_date: string | null;
  display_order: number;
  is_published: boolean;
};
