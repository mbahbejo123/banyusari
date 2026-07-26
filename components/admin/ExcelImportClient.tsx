"use client";

import { useState } from "react";

type ImportResult = {
  ok: boolean;
  validateOnly?: boolean;
  message: string;
  counts?: Record<string, number>;
  errors?: string[];
};

export default function ExcelImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"validate" | "import" | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function submit(validateOnly: boolean) {
    if (!file) {
      setResult({ ok: false, message: "Pilih berkas Excel terlebih dahulu." });
      return;
    }

    setLoading(validateOnly ? "validate" : "import");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("validateOnly", validateOnly ? "true" : "false");

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as ImportResult;
      setResult(payload);
    } catch (error) {
      setResult({
        ok: false,
        message: error instanceof Error ? error.message : "Impor gagal diproses.",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="admin-panel import-panel">
      <div className="import-steps">
        <div><strong>1</strong><span>Unduh template</span></div>
        <div><strong>2</strong><span>Isi tanpa mengubah judul kolom</span></div>
        <div><strong>3</strong><span>Validasi, lalu impor</span></div>
      </div>

      <div className="import-download">
        <a className="button secondary" href="/templates/template-import-data-desa.xlsx" download>
          Unduh Template Excel
        </a>
        <p className="muted">
          Gunakan template resmi ini. Sheet yang kosong akan dilewati dan data yang sudah ada akan diperbarui berdasarkan slug atau kunci datanya.
        </p>
      </div>

      <label className="field span-2">
        <span>Berkas Excel (.xlsx)</span>
        <input
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setResult(null);
          }}
        />
      </label>

      {file ? (
        <p className="file-selected">
          Dipilih: <strong>{file.name}</strong> ({Math.ceil(file.size / 1024)} KB)
        </p>
      ) : null}

      <div className="form-actions">
        <button
          type="button"
          className="button secondary"
          disabled={!file || loading !== null}
          onClick={() => submit(true)}
        >
          {loading === "validate" ? "Memvalidasi..." : "Validasi Berkas"}
        </button>
        <button
          type="button"
          className="button primary"
          disabled={!file || loading !== null}
          onClick={() => submit(false)}
        >
          {loading === "import" ? "Mengimpor..." : "Impor ke Website"}
        </button>
      </div>

      {result ? (
        <div className={result.ok ? "import-result success" : "import-result error"}>
          <h3>{result.ok ? "Berhasil" : "Perlu diperbaiki"}</h3>
          <p>{result.message}</p>

          {result.counts && Object.keys(result.counts).length > 0 ? (
            <div className="import-counts">
              {Object.entries(result.counts).map(([name, count]) => (
                <span key={name}><strong>{count}</strong> {name}</span>
              ))}
            </div>
          ) : null}

          {result.errors && result.errors.length > 0 ? (
            <ol className="import-errors">
              {result.errors.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
            </ol>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
