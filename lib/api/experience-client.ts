import type { ExperienceDTO } from "@/types/experience"
import type { ApiErrorBody, ApiSuccess } from "@/types/project"
import type {
  CreateExperienceInput,
  UpdateExperienceInput,
} from "@/lib/validations/experience"

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

export async function fetchExperience() {
  return parseResponse<ExperienceDTO[]>(await fetch("/api/experience"))
}

export async function fetchExperienceEntry(id: string) {
  return parseResponse<ExperienceDTO>(await fetch(`/api/experience/${id}`))
}

export async function createExperienceRequest(body: CreateExperienceInput) {
  return parseResponse<ExperienceDTO>(
    await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  )
}

export async function updateExperienceRequest(
  id: string,
  body: UpdateExperienceInput,
) {
  return parseResponse<ExperienceDTO>(
    await fetch(`/api/experience/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  )
}

export async function deleteExperienceRequest(id: string) {
  return parseResponse<ExperienceDTO>(
    await fetch(`/api/experience/${id}`, {
      method: "DELETE",
    }),
  )
}
