"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  // 서버 렌더 시점에는 테마를 알 수 없으므로 마운트 후에만 아이콘을 그립니다.
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "밝은 화면으로 전환" : "어두운 화면으로 전환"}
      className="rounded-full border border-slate-200 bg-white/80 p-2.5 text-lg leading-none shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700"
    >
      <span aria-hidden>{isDark === null ? "🌗" : isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
