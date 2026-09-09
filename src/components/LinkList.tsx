import { CLICKS_COLLECTION, getDb } from "@/lib/mongodb";
import { links } from "@/data/profile";
import { LinkCard } from "./LinkCard";

async function getClickCounts(): Promise<Record<string, number>> {
  const db = await getDb();
  if (!db) return {};

  try {
    const docs = await db
      .collection<{ _id: string; count: number }>(CLICKS_COLLECTION)
      .find({})
      .toArray();
    return Object.fromEntries(docs.map((doc) => [doc._id, doc.count]));
  } catch {
    // 집계는 부가 기능이므로 DB 가 죽어도 링크 목록은 그대로 보여줍니다.
    return {};
  }
}

export async function LinkList() {
  const counts = await getClickCounts();

  return (
    <nav className="mt-8 flex flex-col gap-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} clickCount={counts[link.id] ?? 0} />
      ))}
    </nav>
  );
}
