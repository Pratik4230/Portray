import { z } from "zod"

export const contactDeveloperSchema = z.object({
  senderName: z.string().min(1, "Name is required").max(80),
  senderEmail: z.email("Enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(160),
  body: z.string().min(1, "Message is required").max(5000),
})

export type ContactDeveloperInput = z.infer<typeof contactDeveloperSchema>
