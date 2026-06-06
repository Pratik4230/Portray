import { z } from "zod"

const dateLabelSchema = z
  .string()
  .min(1, "Date is required")
  .max(32, "Use a short date label like Jan 2024")

const optionalEndDateSchema = z
  .string()
  .max(32)
  .optional()
  .transform((value) => {
    if (!value?.trim()) return null
    return value.trim()
  })

export const createExperienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(120),
  role: z.string().min(1, "Role is required").max(120),
  startDate: dateLabelSchema,
  endDate: optionalEndDateSchema,
  description: z.string().max(2000).optional().default(""),
  order: z.number().int().optional().default(0),
})

export const updateExperienceSchema = createExperienceSchema.partial()

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>
