import type { ApiErrorBody, ApiSuccess, ProjectDTO } from "@/types/project"
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/validations/project"

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiSuccess<T> | ApiErrorBody

  if (!response.ok || !json.success) {
    const message =
      !json.success && json.error?.message
        ? json.error.message
        : "Request failed"
    throw new Error(message)
  }

  return json.data
}

export async function fetchProjects() {
  return parseResponse<ProjectDTO[]>(await fetch("/api/projects"))
}

export async function fetchProject(id: string) {
  return parseResponse<ProjectDTO>(await fetch(`/api/projects/${id}`))
}

export async function createProjectRequest(body: CreateProjectInput) {
  return parseResponse<ProjectDTO>(
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  )
}

export async function updateProjectRequest(id: string, body: UpdateProjectInput) {
  return parseResponse<ProjectDTO>(
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  )
}

export async function deleteProjectRequest(id: string) {
  return parseResponse<ProjectDTO>(
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    }),
  )
}
