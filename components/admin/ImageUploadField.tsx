"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ImageUploadField({ name, defaultValue = "", folder = "general", label = "Gambar" }: { name: string; defaultValue?: string | null; folder?: string; label?: string }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [status, setStatus] = useState("");

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      setStatus("File harus berupa gambar.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setStatus("Ukuran gambar maksimal 2 MB.");
      return;
    }
    setStatus("Mengunggah...");
    const supabase = createClient();
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("village-media").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      setStatus(error.message);
      return;
    }
    const { data } = supabase.storage.from("village-media").getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("Gambar berhasil diunggah.");
  }

  return (
    <div className="field span-2">
      <label>{label}</label>
      {url ? <img className="upload-preview" src={url} alt="Pratinjau unggahan" /> : null}
      <input type="hidden" name={name} value={url} />
      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) void upload(file);
      }} />
      <div className="inline-actions">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Atau tempel URL gambar" />
        {url ? <button type="button" className="button danger small" onClick={() => setUrl("")}>Hapus dari formulir</button> : null}
      </div>
      {status ? <small>{status}</small> : null}
    </div>
  );
}
