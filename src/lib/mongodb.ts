import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
// ?? 는 빈 문자열을 걸러내지 못해 .env.local 의 `MONGODB_DB=` 가 그대로
// DB 이름이 되고, 드라이버가 URI 기본 DB(test)로 떨어집니다. || 를 씁니다.
const dbName = process.env.MONGODB_DB || "linknamu";

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
