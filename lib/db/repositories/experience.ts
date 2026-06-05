import { connectDB } from "@/lib/db/client"
import { Experience, type ExperienceDocument } from "@/lib/db/models/experience"
import type { ExperienceDTO } from "@/types/experience"

export function toExperienceDTO(doc: ExperienceDocument): ExperienceDTO {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    company: doc.company,
    role: doc.role,
    startDate: doc.startDate,
    endDate: doc.endDate ?? null,
    description: doc.description ?? "",
    order: doc.order ?? 0,
  }
}

export async function listExperienceByUserId(userId: string) {
  await connectDB()
  const docs = await Experience.find({ userId }).sort({ order: 1, startDate: -1 })
  return docs.map((doc) => toExperienceDTO(doc))
}
