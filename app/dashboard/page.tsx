import Link from "next/link"
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
        Welcome, {session?.user.name}. Manage your portfolio from the sidebar.
      </p>
      <p className="text-sm text-muted-foreground">
        Complete your{" "}
        <Link
          href="/dashboard/profile"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          profile
        </Link>
        , add{" "}
        <Link
          href="/dashboard/projects"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          projects
        </Link>{" "}
        and{" "}
        <Link
          href="/dashboard/experience"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          experience
        </Link>
        , then turn on public visibility to appear in the developer directory.
      </p>
    </div>
  )
}
