import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const c = new MongoClient(uri);
    global._mongoClientPromise = c.connect().then(() => c);
  }
  clientPromise = global._mongoClientPromise;
} else {
  const c = new MongoClient(uri);
  clientPromise = c.connect().then(() => c);
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}
