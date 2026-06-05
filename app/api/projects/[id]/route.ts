import {
  deleteProject,
  getProjectByIdForUser,
  updateProject,
} from "@/lib/db/repositories/projects"
import { handleApiError } from "@/lib/api/errors"
import { ok } from "@/lib/api/response"
import { requireSession } from "@/lib/auth/session"
import { updateProjectSchema } from "@/lib/validations/project"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession()
    const { id } = await context.params
    const project = await getProjectByIdForUser(id, session.user.id)
    return ok(project)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireSession()
    const { id } = await context.params
    const body = updateProjectSchema.parse(await request.json())
    const project = await updateProject(id, session.user.id, body)
    return ok(project)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession()
    const { id } = await context.params
    const project = await deleteProject(id, session.user.id)
    return ok(project)
  } catch (error) {
    return handleApiError(error)
  }
}
