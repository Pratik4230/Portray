import { revalidatePath } from "next/cache"

import { getProfileUsernameByUserId } from "@/lib/db/repositories/profiles"

export async function revalidatePublicPortfolio(userId: string) {
  const profile = await getProfileUsernameByUserId(userId)
  if (!profile) return

  revalidatePath("/developers")
  if (profile.isPublic) {
    revalidatePath(`/developers/${profile.username}`)
  }
}

export async function revalidateAfterProfileUpdate(input: {
  username: string
  isPublic: boolean
  previousUsername: string
  wasPublic: boolean
}) {
  revalidatePath("/developers")

  if (input.wasPublic && input.previousUsername !== input.username) {
    revalidatePath(`/developers/${input.previousUsername}`)
  }

  if (input.isPublic) {
    revalidatePath(`/developers/${input.username}`)
  } else if (input.wasPublic) {
    revalidatePath(`/developers/${input.previousUsername}`)
  }
}
