import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
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
      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-8 p-6">
        <aside className="w-40 shrink-0">
          <DashboardNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
