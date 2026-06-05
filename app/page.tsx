import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-medium tracking-tight">Portray</span>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/sign-in" className="hover:underline">
            Sign in
          </Link>
          <Button asChild size="sm">
            <Link href="/sign-up">Get started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="max-w-xl text-3xl font-medium tracking-tight">
          Show who you are. Get discovered.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Portray is where developers publish portfolios and recruiters find talent.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/sign-up">Create account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
