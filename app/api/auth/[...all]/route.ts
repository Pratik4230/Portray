import { toNextJsHandler } from "better-auth/next-js"

import { getAuth } from "@/lib/auth"

let handlers: ReturnType<typeof toNextJsHandler> | null = null

async function getHandlers() {
  if (!handlers) {
    const auth = await getAuth()
    handlers = toNextJsHandler(auth)
  }
  return handlers
}

export async function GET(request: Request) {
  const { GET: getHandler } = await getHandlers()
  return getHandler(request)
}

export async function POST(request: Request) {
  const { POST: postHandler } = await getHandlers()
  return postHandler(request)
}
