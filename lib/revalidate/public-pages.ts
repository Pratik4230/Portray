import { revalidatePath } from "next/cache"

import { getProfileUsernameByUserId } from "@/lib/db/repositories/profiles"

export async function revalidatePublicPortfolio(userId: string) {
  const profile = await getProfileUsernameByUserId(userId)
  if (!profile?.isPublic) return

  revalidatePath("/developers")
  revalidatePath(`/developers/${profile.username}`)
}
