import type { Metadata, Viewport } from "next";
import { ThemeScript } from "@/components/ThemeScript";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} | 링크나무`,
  description: profile.bio,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}
