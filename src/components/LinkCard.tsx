"use client";

import type { LinkItem } from "@/data/profile";

type Props = {
  link: LinkItem;
  clickCount?: number;
};

export function LinkCard({ link, clickCount }: Props) {
  /**
   * 새 탭으로 이동하는 동안에도 요청이 끊기지 않도록 sendBeacon 을 먼저 쓰고,
   * 지원하지 않는 브라우저에서는 keepalive fetch 로 떨어집니다.
   */
  function recordClick() {
    const body = JSON.stringify({ id: link.id });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/clicks",
          new Blob([body], { type: "application/json" }),
        );
        return;
      }
    } catch {}
    void fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={recordClick}
      className="relative flex h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white px-12 text-center font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
    >
      <span className="truncate">{link.label}</span>

      {clickCount !== undefined && (
        <span
          title={`클릭 ${clickCount}회`}
          className="absolute right-4 text-xs font-normal tabular-nums text-slate-400 dark:text-slate-500"
        >
          {clickCount.toLocaleString("ko-KR")}
        </span>
      )}
    </a>
  );
}
