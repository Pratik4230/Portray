'use server'

import { revalidatePath } from "next/cache"

import { createContactMessage } from "@/lib/db/repositories/contact-messages"
import { getPublicProfileByUsername } from "@/lib/db/repositories/profiles"
import { contactDeveloperSchema } from "@/lib/validations/contact"
import type { ContactActionState } from "@/types/contact-message"

export async function contactDeveloper(
  username: string,
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactDeveloperSchema.safeParse({
    senderName: formData.get("senderName"),
    senderEmail: formData.get("senderEmail"),
    subject: formData.get("subject"),
    body: formData.get("body"),
  })

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    }
  }

  const profile = await getPublicProfileByUsername(username)
  if (!profile) {
    return { success: false, error: "Developer not found" }
  }

  try {
    await createContactMessage(profile.userId, parsed.data)
    revalidatePath(`/developers/${username}`)
    return { success: true, error: null }
  } catch {
    return { success: false, error: "Failed to send message" }
  }
}
