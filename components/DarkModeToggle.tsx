"use client";

import { useState, useEffect } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button className="dark-toggle" onClick={toggle} aria-label="Toggle dark mode">
      {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  );
}
