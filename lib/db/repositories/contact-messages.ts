import { connectDB } from "@/lib/db/client"
import {
  ContactMessage,
  type ContactMessageDocument,
} from "@/lib/db/models/contact-message"
import { NotFoundError } from "@/lib/api/errors"
import type { ContactDeveloperInput } from "@/lib/validations/contact"
import type { ContactMessageDTO } from "@/types/contact-message"

export function toContactMessageDTO(doc: ContactMessageDocument): ContactMessageDTO {
  return {
    id: doc._id.toString(),
    developerUserId: doc.developerUserId,
    senderName: doc.senderName,
    senderEmail: doc.senderEmail,
    subject: doc.subject,
    body: doc.body,
    read: doc.read ?? false,
    createdAt: doc.createdAt.toISOString(),
  }
}

export async function countContactMessagesThisMonth(developerUserId: string) {
  await connectDB()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  return ContactMessage.countDocuments({
    developerUserId,
    createdAt: { $gte: startOfMonth },
  })
}

export async function createContactMessage(
  developerUserId: string,
  input: ContactDeveloperInput,
) {
  await connectDB()

  const doc = await ContactMessage.create({
    developerUserId,
    senderName: input.senderName.trim(),
    senderEmail: input.senderEmail.trim().toLowerCase(),
    subject: input.subject.trim(),
    body: input.body.trim(),
    read: false,
  })

  return toContactMessageDTO(doc)
}

export async function listContactMessagesByDeveloperUserId(
  developerUserId: string,
) {
  await connectDB()

  const docs = await ContactMessage.find({ developerUserId }).sort({
    createdAt: -1,
  })

  return docs.map((doc) => toContactMessageDTO(doc))
}

export async function markContactMessageRead(id: string, developerUserId: string) {
  await connectDB()

  const doc = await ContactMessage.findOne({ _id: id, developerUserId })
  if (!doc) {
    throw new NotFoundError("Message not found")
  }

  doc.read = true
  await doc.save()

  return toContactMessageDTO(doc)
}
