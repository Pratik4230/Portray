import { z } from "zod"

export const projectSlugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(64, "Slug must be at most 64 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens only",
  )

export function normalizeProjectSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function slugFromTitle(title: string) {
  return normalizeProjectSlug(title) || "project"
}

const techStackSchema = z.union([
  z.array(z.string()),
  z.string().transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ),
])

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.url().safeParse(value).success, "Invalid URL")

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  slug: projectSlugSchema,
  description: z.string().min(1, "Description is required").max(500),
  longDescription: z.string().max(5000).optional(),
  techStack: techStackSchema.default([]),
  repoUrl: optionalUrlSchema,
  liveUrl: optionalUrlSchema,
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
})

export const updateProjectSchema = createProjectSchema.partial()

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
