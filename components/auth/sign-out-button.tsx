"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function signOut() {
    setLoading(true)
    await authClient.signOut()
    setLoading(false)
    router.push("/")
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={signOut} disabled={loading}>
      {loading ? "..." : "Sign out"}
    </Button>
  )
}
