import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "linknamu";

/**
 * 개발 모드에서 HMR 로 커넥션이 계속 새로 생기는 것을 막기 위해
 * 전역에 클라이언트 프라미스를 캐시합니다.
 */
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalForMongo._mongoClientPromise;
}

/** MONGODB_URI 가 없으면 null 을 돌려주고, 호출부에서 집계를 건너뜁니다. */
export async function getDb(): Promise<Db | null> {
  const clientPromise = getClientPromise();
  if (!clientPromise) return null;
  const client = await clientPromise;
  return client.db(dbName);
}

export const CLICKS_COLLECTION = "clicks";
