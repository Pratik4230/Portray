import { z } from "zod"

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.url().safeParse(value).success, "Invalid URL")

const skillsSchema = z.union([
  z.array(z.string()),
  z.string().transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ),
])

const socialLinksSchema = z.object({
  github: optionalUrlSchema,
  linkedin: optionalUrlSchema,
  x: optionalUrlSchema,
  website: optionalUrlSchema,
})

export const updateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(80).optional(),
  headline: z.string().max(160).optional(),
  bio: z.string().max(2000).optional(),
  avatarUrl: optionalUrlSchema,
  location: z.string().max(120).optional(),
  skills: skillsSchema.optional(),
  socialLinks: socialLinksSchema.optional(),
  isPublic: z.boolean().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
