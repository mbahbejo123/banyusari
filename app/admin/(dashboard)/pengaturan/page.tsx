import SettingsForm from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import type { SiteSettings } from "@/lib/types";
export default async function SettingsPage() { const { supabase } = await requireAdmin(); const { data } = await supabase.from("site_settings").select("*").eq("id",1).maybeSingle(); return <><div className="admin-heading"><div><h1>Profil Desa</h1><p>Seluruh identitas utama website dapat diubah di sini.</p></div></div><SettingsForm item={data as SiteSettings | null} /></>; }
