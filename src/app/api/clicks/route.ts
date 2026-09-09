import { NextResponse } from "next/server";
import { CLICKS_COLLECTION, getDb } from "@/lib/mongodb";
import { links } from "@/data/profile";

export const dynamic = "force-dynamic";

const validIds = new Set(links.map((link) => link.id));

/** 링크별 누적 클릭 수 조회 */
export async function GET() {
  const db = await getDb();
  if (!db) return NextResponse.json({ counts: {} });

  const docs = await db
    .collection<{ _id: string; count: number }>(CLICKS_COLLECTION)
    .find({})
    .toArray();

  const counts: Record<string, number> = {};
  for (const doc of docs) counts[doc._id] = doc.count;
  return NextResponse.json({ counts });
}

/** 링크 클릭 1회 기록 */
export async function POST(request: Request) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문" }, { status: 400 });
  }

  if (typeof id !== "string" || !validIds.has(id)) {
    return NextResponse.json({ error: "알 수 없는 링크" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) return NextResponse.json({ ok: true, skipped: true });

  const result = await db
    .collection<{ _id: string; count: number }>(CLICKS_COLLECTION)
    .findOneAndUpdate(
      { _id: id },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true, returnDocument: "after" },
    );

  return NextResponse.json({ ok: true, count: result?.count ?? 1 });
}
