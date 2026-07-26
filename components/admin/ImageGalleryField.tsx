"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ImageGalleryField({
  name,
  defaultValue,
  folder = "general",
  label = "Galeri Gambar",
}: {
  name: string;
  defaultValue?: string[] | null;
  folder?: string;
  label?: string;
}) {
  const [images, setImages] = useState<string[]>(defaultValue || []);
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
    const { error } = await supabase.storage
      .from("village-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      setStatus(error.message);
      return;
    }
    const { data } = supabase.storage.from("village-media").getPublicUrl(path);
    setImages((prev) => [...prev, data.publicUrl]);
    setStatus("Gambar berhasil diunggah.");
  }

  function remove(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  return (
    <div className="field span-2">
      <label>{label}</label>
      {images.length > 0 ? (
        <div className="admin-gallery-grid">
          {images.map((url, index) => (
            <div className="admin-gallery-item" key={index}>
              <img src={url} alt={`Gambar ${index + 1}`} />
              <div className="admin-gallery-item-actions">
                <button
                  type="button"
                  className="button small"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="button small"
                  onClick={() => moveDown(index)}
                  disabled={index === images.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="button danger small"
                  onClick={() => remove(index)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      <div className="inline-actions">
        <input
          value=""
          placeholder="Atau tempel URL gambar lalu tekan Tambah"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const input = e.currentTarget;
              const url = input.value.trim();
              if (url) {
                setImages((prev) => [...prev, url]);
                input.value = "";
              }
            }
          }}
        />
        <button
          type="button"
          className="button secondary small"
          onClick={(e) => {
            const input = e.currentTarget
              .previousElementSibling as HTMLInputElement;
            const url = input?.value?.trim();
            if (url) {
              setImages((prev) => [...prev, url]);
              input.value = "";
            }
          }}
        >
          Tambah
        </button>
      </div>

      {status ? <small>{status}</small> : null}
    </div>
  );
}
