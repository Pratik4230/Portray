import { handleApiError } from "@/lib/api/errors"
import { ok } from "@/lib/api/response"
import { requireSession } from "@/lib/auth/session"
import {
  getProfileByUserId,
  updateProfileForUser,
} from "@/lib/db/repositories/profiles"
import { revalidateAfterProfileUpdate } from "@/lib/revalidate/public-pages"
import { updateProfileSchema } from "@/lib/validations/profile"

export async function GET() {
  try {
    const session = await requireSession()
    const profile = await getProfileByUserId(session.user.id)
    return ok(profile)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession()
    const body = updateProfileSchema.parse(await request.json())
    const { profile, previous } = await updateProfileForUser(
      session.user.id,
      body,
    )

    await revalidateAfterProfileUpdate({
      username: profile.username,
      isPublic: profile.isPublic,
      previousUsername: previous.username,
      wasPublic: previous.isPublic,
    })

    return ok(profile)
  } catch (error) {
    return handleApiError(error)
  }
}
