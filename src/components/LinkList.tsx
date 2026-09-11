"use client";

import { useCallback, useEffect, useState } from "react";
import { links } from "@/data/profile";
import { LinkCard } from "./LinkCard";

export function LinkList() {
  /**
   * 데이터를 받기 전에는 비어 있고, 카드는 0회로 그려집니다.
   * 응답이 도착하면 실제 집계값으로 한 번에 갈아끼웁니다.
   */
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/clicks", { signal: controller.signal, cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.counts) setCounts(data.counts);
      })
      .catch(() => {
        // 집계는 부가 기능이므로, 실패하면 0회 표시를 그대로 둡니다.
      });

    return () => controller.abort();
  }, []);

  /** 클릭한 카드의 숫자만 즉시 바꿔치기 (낙관적 갱신 → 서버 확정값) */
  const handleCounted = useCallback((id: string, count: number) => {
    setCounts((prev) => ({ ...prev, [id]: count }));
  }, []);

  return (
    <nav className="mt-8 flex flex-col gap-3">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          clickCount={counts[link.id] ?? 0}
          onCounted={handleCounted}
        />
      ))}
    </nav>
  );
}
