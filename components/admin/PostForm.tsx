import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { allowedPostTypes } from "@/lib/import-config";
import { savePost } from "@/app/admin/(dashboard)/actions";
import type { Post } from "@/lib/types";

function datetimeLocal(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

export default function PostForm({ item }: { item?: Post | null }) {
  return (
    <form className="admin-panel form-grid" action={savePost}>
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <div className="field">
        <label>Jenis</label>
        <select name="post_type" defaultValue={item?.post_type || "Berita"}>
          {allowedPostTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Status</label>
        <select name="status" defaultValue={item?.status || "draft"}>
          <option value="draft">Draf</option>
          <option value="published">Terbit</option>
          <option value="archived">Arsip</option>
        </select>
      </div>
      <div className="field span-2">
        <label>Judul</label>
        <input name="title" required defaultValue={item?.title || ""} />
      </div>
      <div className="field">
        <label>Slug URL</label>
        <input name="slug" defaultValue={item?.slug || ""} />
      </div>
      <div className="field">
        <label>Waktu Terbit</label>
        <input type="datetime-local" name="published_at" defaultValue={datetimeLocal(item?.published_at)} />
      </div>
      <div className="field span-2">
        <label>Ringkasan</label>
        <textarea name="excerpt" defaultValue={item?.excerpt || ""} />
      </div>
      <div className="field span-2">
        <label>Isi Berita</label>
        <textarea name="content" style={{ minHeight: 260 }} defaultValue={item?.content || ""} />
      </div>
      <ImageUploadField name="cover_image_url" defaultValue={item?.cover_image_url} folder="posts" label="Gambar Sampul" />
      <div className="form-actions">
        <button className="button primary">Simpan</button>
        <Link className="button danger" href="/admin/berita">Batal</Link>
      </div>
    </form>
  );
}
