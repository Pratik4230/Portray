import { connectDB } from "@/lib/db/client"
import { ContactMessage } from "@/lib/db/models/contact-message"

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
