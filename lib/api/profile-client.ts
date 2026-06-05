import type { ProfileDTO } from "@/types/profile"
import type { ApiErrorBody, ApiSuccess } from "@/types/project"
import type { UpdateProfileInput } from "@/lib/validations/profile"

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

export async function fetchProfile() {
  return parseResponse<ProfileDTO>(await fetch("/api/profile"))
}

export async function updateProfileRequest(body: UpdateProfileInput) {
  return parseResponse<ProfileDTO>(
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  )
}
