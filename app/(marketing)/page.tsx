import Link from "next/link"
import { headers } from "next/headers"

import { DeveloperCard } from "@/components/developers/developer-card"
import { Button } from "@/components/ui/button"
import { getAuth } from "@/lib/auth"
import { listFeaturedPublicProfiles } from "@/lib/db/repositories/profiles"

export default async function HomePage() {
  const auth = await getAuth()
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const featured = await listFeaturedPublicProfiles(3)

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <h1 className="max-w-xl text-3xl font-medium tracking-tight">
          Show who you are. Get discovered.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Portray is where developers publish portfolios and recruiters find
          talent.
        </p>
        <div className="flex gap-3">
          {session ? (
            <>
              <Button asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/developers">Explore developers</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link href="/sign-up">Create account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/developers">Explore developers</Link>
              </Button>
            </>
          )}
        </div>
      </section>
      {featured.length > 0 ? (
        <section className="border-t px-6 py-12">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-medium tracking-tight">
                Recently updated portfolios
              </h2>
              <Link
                href="/developers"
                className="text-sm text-muted-foreground hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((profile) => (
                <DeveloperCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}
