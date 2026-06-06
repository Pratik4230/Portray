import { handleApiError } from "@/lib/api/errors"
import { ok } from "@/lib/api/response"
import { requireSession } from "@/lib/auth/session"
import {
  createExperience,
  listExperienceByUserId,
} from "@/lib/db/repositories/experience"
import { revalidatePublicPortfolio } from "@/lib/revalidate/public-pages"
import { createExperienceSchema } from "@/lib/validations/experience"

export async function GET() {
  try {
    const session = await requireSession()
    const experience = await listExperienceByUserId(session.user.id)
    return ok(experience)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const body = createExperienceSchema.parse(await request.json())
    const entry = await createExperience(session.user.id, body)
    await revalidatePublicPortfolio(session.user.id)
    return ok(entry, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
