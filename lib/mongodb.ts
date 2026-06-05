import { MongoClient, type Db } from "mongodb"

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient
  mongoClientPromise?: Promise<MongoClient>
}

function getUri() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error(
      "MONGO_URI is not defined. Copy .env.example to .env.local and set your connection string.",
    )
  }
  return uri
}

export function getMongoClient(): Promise<MongoClient> {
  if (globalForMongo.mongoClient) {
    return Promise.resolve(globalForMongo.mongoClient)
  }

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(getUri())
    globalForMongo.mongoClientPromise = client.connect().then((connected) => {
      globalForMongo.mongoClient = connected
      return connected
    })
  }

  return globalForMongo.mongoClientPromise
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient()
  const uri = getUri()
  const pathname = new URL(uri.replace(/^mongodb(\+srv)?:\/\//, "https://")).pathname
  const dbName = pathname.replace(/^\//, "").split("/")[0] || "portray"
  return client.db(dbName)
}
