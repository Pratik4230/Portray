"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { getAuth } from "@/lib/auth"
import { markContactMessageRead } from "@/lib/db/repositories/contact-messages"
import type { MarkMessageReadState } from "@/types/contact-message"

export async function markMessageRead(
  messageId: string,
): Promise<MarkMessageReadState> {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await markContactMessageRead(messageId, session.user.id)
    revalidatePath("/dashboard/messages")
    return { success: true, error: null }
  } catch {
    return { success: false, error: "Failed to update message" }
  }
}
