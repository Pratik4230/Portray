import Link from "next/link"
import { headers } from "next/headers"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { Button } from "@/components/ui/button"
import { getAuth } from "@/lib/auth"

export async function MarketingHeader() {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="font-medium tracking-tight">
        Portray
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link href="/developers" className="hover:underline">
          Explore developers
        </Link>
        {session ? (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link href="/sign-in" className="hover:underline">
              Sign in
            </Link>
            <Button asChild size="sm">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  )
}
