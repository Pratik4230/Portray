"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { markMessageRead } from "@/lib/actions/mark-message-read"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ContactMessageDTO } from "@/types/contact-message"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function MessagesInbox({ messages }: { messages: ContactMessageDTO[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleMarkRead(messageId: string) {
    startTransition(async () => {
      await markMessageRead(messageId)
      router.refresh()
    })
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No messages yet. When recruiters contact you from your public
          portfolio, they will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="truncate">{message.subject}</CardTitle>
                {!message.read ? <Badge>New</Badge> : null}
              </div>
              <CardDescription>
                {message.senderName} · {message.senderEmail} ·{" "}
                {formatDate(message.createdAt)}
              </CardDescription>
            </div>
            {!message.read ? (
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => handleMarkRead(message.id)}
              >
                Mark read
              </Button>
            ) : null}
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {message.body}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
