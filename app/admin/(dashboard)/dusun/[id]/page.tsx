import { notFound } from "next/navigation";
import HamletForm from "@/components/admin/HamletForm";
import { requireAdmin } from "@/lib/auth";
import type { Hamlet } from "@/lib/types";
export default async function HamletEditorPage({params}:{params:Promise<{id:string}>}) { const {id}=await params; const {supabase}=await requireAdmin(); let item:Hamlet|null=null; if(id!=="baru"){ const {data}=await supabase.from("hamlets").select("*").eq("id",id).maybeSingle(); if(!data) notFound(); item=data as Hamlet; } return <><div className="admin-heading"><div><h1>{item?"Edit Dusun":"Tambah Dusun"}</h1><p>Isi data wilayah dusun dan tentukan status publikasinya.</p></div></div><HamletForm item={item}/></>; }
