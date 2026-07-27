"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconLogin } from "@tabler/icons-react";

export default function LoginModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) {
    return (
      <button className="login-trigger" onClick={() => setOpen(true)} aria-label="Login">
        <IconLogin size={20} />
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setOpen(false)}>×</button>
        <h2>Menu Login</h2>
        <div className="modal-actions">
          <Link href="/admin/login" className="button primary full" onClick={() => setOpen(false)}>
            Login Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
