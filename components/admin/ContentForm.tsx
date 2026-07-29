"use client";

import { useState } from "react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ImageGalleryField from "@/components/admin/ImageGalleryField";
import { saveContent } from "@/app/admin/(dashboard)/actions";
import { contentFieldRules, sectionConfig } from "@/lib/config";
import type { ContentItem, ContentSection, Hamlet } from "@/lib/types";

export default function ContentForm({
  section,
  item,
  hamlets,
}: {
  section: ContentSection;
  item?: ContentItem | null;
  hamlets: Hamlet[];
}) {
  const config = sectionConfig[section];
  const action = saveContent.bind(null, section);
  const meta = item?.metadata || {};
  const [category, setCategory] = useState(item?.category || "");
  const ruleKey = `${section}:${category}`;
  const rules = contentFieldRules[ruleKey as keyof typeof contentFieldRules] || {};

  return (
    <form className="admin-panel form-grid" action={action}>
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="field">
        <label>Judul</label>
        <input name="title" required defaultValue={item?.title || ""} />
      </div>

      <div className="field">
        <label>Slug URL</label>
        <input name="slug" defaultValue={item?.slug || ""} placeholder="otomatis dari judul" />
      </div>

      <div className="field">
        <label>Kategori</label>
        <input
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          list={`categories-${section}`}
        />
        <datalist id={`categories-${section}`}>
          {config.categories.map((cat) => (
            <option value={cat} key={cat} />
          ))}
        </datalist>
      </div>

      <div className="field">
        <label>Dusun</label>
        <select name="hamlet_id" defaultValue={item?.hamlet_id || ""}>
          <option value="">Tidak ditentukan</option>
          {hamlets.map((hamlet) => (
            <option value={hamlet.id} key={hamlet.id}>
              {hamlet.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field span-2">
        <label>Ringkasan</label>
        <textarea name="summary" defaultValue={item?.summary || ""} />
      </div>

      <div className="field span-2">
        <label>Deskripsi Lengkap</label>
        <textarea name="description" defaultValue={item?.description || ""} />
      </div>

      <div className="field">
        <label>Nama Lokasi</label>
        <input name="location_name" defaultValue={item?.location_name || ""} />
      </div>

      <div className="field">
        <label>Tautan Google Maps</label>
        <input type="url" name="maps_url" defaultValue={item?.maps_url || ""} />
      </div>

      <ImageUploadField
        name="cover_image_url"
        defaultValue={item?.cover_image_url}
        folder={section}
        label="Gambar Utama"
      />

      {rules.galleryLabel ? (
        <ImageGalleryField
          name="metadata_images"
          defaultValue={Array.isArray(meta.images) ? (meta.images as string[]) : null}
          folder={`${section}/${rules.galleryFolder || "gallery"}`}
          label={rules.galleryLabel}
        />
      ) : null}

      <div className="field">
        <label>Kondisi</label>
        <input
          name="condition"
          defaultValue={String(meta.condition || "")}
          placeholder="Baik, rusak ringan, dan lainnya"
        />
      </div>

      {rules.statusAktif ? (
        <div className="field">
          <label>Status Pengurus</label>
          <select name="status_aktif" defaultValue={String(meta.status_aktif || "")}>
            <option value="">Pilih status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
        </div>
      ) : null}

      <div className="field">
        <label>Jenis Konstruksi atau Jenis Usaha</label>
        <input
          name="construction_type"
          defaultValue={String(meta.construction_type || "")}
        />
      </div>

      {rules.measurements ? (
        <>
          <div className="field">
            <label>Total Panjang (meter)</label>
            <input
              type="number"
              step="0.01"
              name="panjang_meter"
              defaultValue={
                meta.panjang_meter === null || meta.panjang_meter === undefined
                  ? ""
                  : String(meta.panjang_meter)
              }
            />
          </div>
          <div className="field">
            <label>Panjang Permanen (meter)</label>
            <input
              type="number"
              step="0.01"
              name="panjang_permanen_meter"
              defaultValue={
                meta.panjang_permanen_meter === null ||
                meta.panjang_permanen_meter === undefined
                  ? ""
                  : String(meta.panjang_permanen_meter)
              }
            />
          </div>
          <div className="field">
            <label>Panjang Belum Permanen (meter)</label>
            <input
              type="number"
              step="0.01"
              name="panjang_belum_permanen_meter"
              defaultValue={
                meta.panjang_belum_permanen_meter === null ||
                meta.panjang_belum_permanen_meter === undefined
                  ? ""
                  : String(meta.panjang_belum_permanen_meter)
              }
            />
          </div>
          <div className="field">
            <label>Lebar (meter)</label>
            <input
              type="number"
              step="0.01"
              name="lebar_meter"
              defaultValue={
                meta.lebar_meter === null || meta.lebar_meter === undefined
                  ? ""
                  : String(meta.lebar_meter)
              }
            />
          </div>
        </>
      ) : null}

      <div className="field">
        <label>Jumlah, Panjang, atau Luas</label>
        <input
          type="number"
          step="0.01"
          name="quantity"
          defaultValue={
            meta.quantity === null || meta.quantity === undefined
              ? ""
              : String(meta.quantity)
          }
        />
      </div>

      <div className="field">
        <label>Satuan</label>
        <input
          name="unit"
          defaultValue={String(meta.unit || "")}
          placeholder="unit, meter, hektare"
        />
      </div>

      <div className="field">
        <label>Tahun</label>
        <input
          type="number"
          name="year"
          defaultValue={
            meta.year === null || meta.year === undefined
              ? ""
              : String(meta.year)
          }
        />
      </div>

      <div className="field">
        <label>Pengelola atau Penanggung Jawab</label>
        <input
          name="manager_name"
          defaultValue={String(meta.manager_name || "")}
        />
      </div>

      <div className="field">
        <label>Nomor Kontak</label>
        <input name="phone" defaultValue={String(meta.phone || "")} />
      </div>

      <div className="field">
        <label>Jadwal</label>
        <input name="schedule" defaultValue={String(meta.schedule || "")} />
      </div>

      <div className="field">
        <label>Urutan Tampilan</label>
        <input
          type="number"
          name="display_order"
          defaultValue={item?.display_order || 0}
        />
      </div>

      <label className="checkbox-field">
        <input type="checkbox" name="is_featured" defaultChecked={item?.is_featured} />{" "}
        Tampilkan di beranda
      </label>

      <label className="checkbox-field">
        <input type="checkbox" name="is_published" defaultChecked={item?.is_published} />{" "}
        Publikasikan
      </label>

      <div className="form-actions">
        <button className="button primary">Simpan</button>
        <Link className="button danger" href={`/admin/konten/${section}`}>
          Batal
        </Link>
      </div>
    </form>
  );
}
