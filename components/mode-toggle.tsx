"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        flex items-center justify-center 
        w-10 h-10 rounded-lg
        border border-black/10 dark:border-white/10
        transition-all duration-300
        hover:bg-black/5 dark:hover:bg-white/10
      "
    >
      {/* Sun Icon (light mode) */}
      <Sun
        className="
          h-5 w-5 text-yellow-500 transition-all duration-300
          dark:opacity-0 dark:rotate-90 dark:scale-0
        "
      />

      {/* Moon Icon (dark mode) */}
      <Moon
        className="
          h-5 w-5 absolute text-blue-400 transition-all duration-300
          opacity-0 scale-0 rotate-90
          dark:opacity-100 dark:scale-100 dark:rotate-0
        "
      />
    </button>
  );
}
