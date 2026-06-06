import { handleApiError } from "@/lib/api/errors"
import { ok } from "@/lib/api/response"
import { requireSession } from "@/lib/auth/session"
import {
  deleteExperience,
  getExperienceByIdForUser,
  updateExperience,
} from "@/lib/db/repositories/experience"
import { revalidatePublicPortfolio } from "@/lib/revalidate/public-pages"
import { updateExperienceSchema } from "@/lib/validations/experience"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession()
    const { id } = await context.params
    const entry = await getExperienceByIdForUser(id, session.user.id)
    return ok(entry)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireSession()
    const { id } = await context.params
    const body = updateExperienceSchema.parse(await request.json())
    const entry = await updateExperience(id, session.user.id, body)
    await revalidatePublicPortfolio(session.user.id)
    return ok(entry)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession()
    const { id } = await context.params
    const entry = await deleteExperience(id, session.user.id)
    await revalidatePublicPortfolio(session.user.id)
    return ok(entry)
  } catch (error) {
    return handleApiError(error)
  }
}
