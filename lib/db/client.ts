import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
}

if (!global.mongooseCache) {
  global.mongooseCache = cache
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI is not defined. Copy .env.example to .env.local and set your connection string."
    )
  }

  if (cache.conn) {
    return cache.conn
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    })
  }

  try {
    cache.conn = await cache.promise
  } catch (error) {
    cache.promise = null
    throw error
  }

  return cache.conn
}

export function isDBConfigured(): boolean {
  return Boolean(MONGO_URI)
}
