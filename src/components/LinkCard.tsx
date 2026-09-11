"use client";

import type { LinkItem } from "@/data/profile";

type Props = {
  link: LinkItem;
  clickCount?: number;
  /** 집계가 확정되면 목록에 새 값을 알려 줍니다. */
  onCounted?: (id: string, count: number) => void;
};

export function LinkCard({ link, clickCount, onCounted }: Props) {
  /**
   * 클릭 즉시 화면의 숫자를 1 올리고(낙관적 갱신), 서버가 확정 집계를
   * 돌려주면 그 값으로 맞춥니다. 다른 방문자의 클릭까지 반영하기 위함입니다.
   *
   * 새 탭으로 열리는 동안에도 요청이 끊기지 않도록 keepalive 로 보내고,
   * fetch 가 실패하는 환경에서는 sendBeacon 으로 떨어집니다.
   */
  function recordClick() {
    onCounted?.(link.id, (clickCount ?? 0) + 1);

    const body = JSON.stringify({ id: link.id });

    void fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.count === "number") onCounted?.(link.id, data.count);
      })
      .catch(() => {
        try {
          navigator.sendBeacon?.(
            "/api/clicks",
            new Blob([body], { type: "application/json" }),
          );
        } catch {}
      });
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={recordClick}
      className="relative flex h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white px-12 text-center font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
    >
      {link.emoji && (
        <span aria-hidden className="mr-2 shrink-0">
          {link.emoji}
        </span>
      )}
      <span className="truncate">{link.label}</span>

      {clickCount !== undefined && (
        <span
          title={`클릭 ${clickCount.toLocaleString("ko-KR")}회`}
          className="absolute right-4 text-xs font-normal tabular-nums text-slate-400 dark:text-slate-500"
        >
          {clickCount.toLocaleString("ko-KR")}회
        </span>
      )}
    </a>
  );
}
