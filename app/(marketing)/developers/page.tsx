import type { Metadata } from "next"

import { DeveloperCard } from "@/components/developers/developer-card"
import { DevelopersSearch } from "@/components/developers/developers-search"
import { listPublicProfiles } from "@/lib/db/repositories/profiles"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Developers | Portray",
  description: "Browse public developer portfolios on Portray.",
}

type PageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function DevelopersPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const profiles = await listPublicProfiles(q)

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium tracking-tight">Developers</h1>
          <p className="text-muted-foreground">
            Discover developers who have made their portfolios public.
          </p>
        </div>
        <DevelopersSearch query={q} />
        {profiles.length === 0 ? (
          <p className="text-muted-foreground">
            {q
              ? "No developers match your search."
              : "No public portfolios yet. Be the first to publish yours."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <DeveloperCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
