import { notFound } from "next/navigation";
import PopulationForm from "@/components/admin/PopulationForm";
import { requireAdmin } from "@/lib/auth";
import type { Hamlet,PopulationStatistic } from "@/lib/types";
export default async function PopulationEditorPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const {supabase}=await requireAdmin();const {data:hamletData}=await supabase.from("hamlets").select("*").order("display_order");let item:PopulationStatistic|null=null;if(id!=="baru"){const {data}=await supabase.from("population_statistics").select("*").eq("id",id).maybeSingle();if(!data)notFound();item=data as PopulationStatistic;}return <><div className="admin-heading"><div><h1>{item?"Edit Statistik":"Tambah Statistik"}</h1></div></div><PopulationForm item={item} hamlets={(hamletData||[]) as Hamlet[]}/></>}
