import {
  createProject,
  listProjectsByUserId,
} from "@/lib/db/repositories/projects"
import { handleApiError } from "@/lib/api/errors"
import { ok } from "@/lib/api/response"
import { requireSession } from "@/lib/auth/session"
import { createProjectSchema } from "@/lib/validations/project"

export async function GET() {
  try {
    const session = await requireSession()
    const projects = await listProjectsByUserId(session.user.id)
    return ok(projects)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const body = createProjectSchema.parse(await request.json())
    const project = await createProject(session.user.id, body)
    return ok(project, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
