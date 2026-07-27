"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/berita?cari=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form className="search-bar" onSubmit={submit}>
      <input
        type="search"
        placeholder="Cari..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" aria-label="Cari">
        <IconSearch size={18} />
      </button>
    </form>
  );
}
