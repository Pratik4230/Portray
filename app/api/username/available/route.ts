import { NextResponse } from "next/server"

import { isUsernameTaken } from "@/lib/profile/create-profile"
import { normalizeUsername, usernameSchema } from "@/lib/validations/username"

export async function GET(request: Request) {
  const username = normalizeUsername(
    new URL(request.url).searchParams.get("username") ?? "",
  )

  if (!usernameSchema.safeParse(username).success) {
    return NextResponse.json({
      success: true,
      data: { available: false, reason: "invalid" },
    })
  }

  const taken = await isUsernameTaken(username)

  return NextResponse.json({
    success: true,
    data: { available: !taken },
  })
}
