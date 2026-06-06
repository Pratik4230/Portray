import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { MessagesInbox } from "@/components/dashboard/messages-inbox"
import { getAuth } from "@/lib/auth"
import { listContactMessagesByDeveloperUserId } from "@/lib/db/repositories/contact-messages"

export default async function DashboardMessagesPage() {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const messages = await listContactMessagesByDeveloperUserId(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Inbox from recruiters who contact you on your public portfolio.
        </p>
      </div>
      <MessagesInbox messages={messages} />
    </div>
  )
}
