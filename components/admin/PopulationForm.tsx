"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { savePopulation } from "@/app/admin/(dashboard)/actions";
import { populationCategories, populationTypeLabels } from "@/lib/config";
import type { Hamlet, PopulationStatistic } from "@/lib/types";

export default function PopulationForm({ item, hamlets }: { item?: PopulationStatistic | null; hamlets: Hamlet[] }) {
  const [type, setType] = useState<keyof typeof populationCategories>(item?.statistic_type as keyof typeof populationCategories || "gender");
  const [category, setCategory] = useState(item?.category || "");

  const cats = populationCategories[type as keyof typeof populationCategories] || [];
  useEffect(() => {
    if (!cats.includes(category)) setCategory("");
  }, [type]);

  return (
    <form className="admin-panel form-grid" action={savePopulation}>
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="field">
        <label>Jenis Statistik</label>
        <select name="statistic_type" required value={type} onChange={(e) => setType(e.target.value as keyof typeof populationCategories)}>
          {Object.entries(populationTypeLabels).map(([value, label]) => (
            <option value={value} key={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Kategori</label>
        <select name="category" required value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Pilih kategori</option>
          {cats.map((cat) => (
            <option value={cat} key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Wilayah</label>
        <select name="hamlet_id" defaultValue={item?.hamlet_id || ""}>
          <option value="">Seluruh Desa</option>
          {hamlets.map((hamlet) => (
            <option value={hamlet.id} key={hamlet.id}>{hamlet.name}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Jumlah</label>
        <input type="number" min="0" name="total" required defaultValue={item?.total ?? 0} />
      </div>

      <div className="field">
        <label>Tahun Data</label>
        <input type="number" name="period_year" required defaultValue={item?.period_year || new Date().getFullYear()} />
      </div>

      <div className="field">
        <label>Urutan Tampilan</label>
        <input type="number" name="display_order" defaultValue={item?.display_order || 0} />
      </div>

      <label className="checkbox-field">
        <input type="checkbox" name="is_published" defaultChecked={item?.is_published} /> Publikasikan
      </label>

      <div className="form-actions">
        <button className="button primary" type="submit">Simpan</button>
        <Link className="button danger" href="/admin/penduduk">Batal</Link>
      </div>
    </form>
  );
}
