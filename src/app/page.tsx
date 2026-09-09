import { LinkList } from "@/components/LinkList";
import { Profile } from "@/components/Profile";
import { ThemeToggle } from "@/components/ThemeToggle";

// 클릭 수를 매 요청마다 새로 읽습니다.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <Profile />
      <LinkList />

      <footer className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">
        🌳 링크나무로 만들었습니다
      </footer>
    </main>
  );
}
