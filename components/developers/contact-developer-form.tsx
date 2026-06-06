"use client"

import { useActionState } from "react"

import { contactDeveloper } from "@/lib/actions/contact-developer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ContactActionState } from "@/types/contact-message"

const initialState: ContactActionState = {
  success: false,
  error: null,
}

export function ContactDeveloperForm({ username }: { username: string }) {
  const [state, formAction, pending] = useActionState(
    contactDeveloper.bind(null, username),
    initialState,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact developer</CardTitle>
        <CardDescription>
          Send a message without creating an account. The developer will see it
          in their dashboard inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.success ? (
          <p className="text-sm text-muted-foreground">
            Message sent. Thanks for reaching out.
          </p>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="senderName">Your name</Label>
                <Input
                  id="senderName"
                  name="senderName"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Your email</Label>
                <Input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea id="body" name="body" rows={5} required />
            </div>
            {state.error ? (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending ? "Sending..." : "Send message"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
