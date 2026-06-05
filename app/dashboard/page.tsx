import { headers } from "next/headers"

import { getAuth } from "@/lib/auth"

export default async function DashboardPage() {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <h1 className="text-2xl font-medium">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, {session?.user.name}. Your portfolio tools will live here.
      </p>
    </div>
  )
}
