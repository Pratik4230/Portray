import { connectDB } from "@/lib/db/client"
import { Experience, type ExperienceDocument } from "@/lib/db/models/experience"
import { NotFoundError } from "@/lib/api/errors"
import type {
  CreateExperienceInput,
  UpdateExperienceInput,
} from "@/lib/validations/experience"
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

export async function getExperienceByIdForUser(id: string, userId: string) {
  await connectDB()
  const doc = await Experience.findOne({ _id: id, userId })
  if (!doc) {
    throw new NotFoundError("Experience entry not found")
  }
  return toExperienceDTO(doc)
}

export async function createExperience(
  userId: string,
  input: CreateExperienceInput,
) {
  await connectDB()

  const doc = await Experience.create({
    userId,
    company: input.company,
    role: input.role,
    startDate: input.startDate,
    endDate: input.endDate ?? null,
    description: input.description ?? "",
    order: input.order ?? 0,
  })

  return toExperienceDTO(doc)
}

export async function updateExperience(
  id: string,
  userId: string,
  input: UpdateExperienceInput,
) {
  await connectDB()

  const doc = await Experience.findOne({ _id: id, userId })
  if (!doc) {
    throw new NotFoundError("Experience entry not found")
  }

  if (input.company !== undefined) doc.company = input.company
  if (input.role !== undefined) doc.role = input.role
  if (input.startDate !== undefined) doc.startDate = input.startDate
  if (input.endDate !== undefined) doc.endDate = input.endDate
  if (input.description !== undefined) doc.description = input.description
  if (input.order !== undefined) doc.order = input.order

  await doc.save()
  return toExperienceDTO(doc)
}

export async function deleteExperience(id: string, userId: string) {
  await connectDB()
  const doc = await Experience.findOneAndDelete({ _id: id, userId })
  if (!doc) {
    throw new NotFoundError("Experience entry not found")
  }
  return toExperienceDTO(doc)
}
