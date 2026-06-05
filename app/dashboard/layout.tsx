import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { getAuth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="font-medium tracking-tight">
          Portray
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{session.user.email}</span>
          <SignOutButton />
        </nav>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
