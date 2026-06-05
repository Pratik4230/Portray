import { z } from "zod"

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(24, "Username must be at most 24 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens only",
  )

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase()
}
