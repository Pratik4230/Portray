import { headers } from "next/headers"

import { UnauthorizedError } from "@/lib/api/errors"
import { getAuth } from "@/lib/auth"

export async function requireSession() {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new UnauthorizedError()
  }

  return session
}
