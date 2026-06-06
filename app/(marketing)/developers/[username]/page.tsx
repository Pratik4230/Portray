import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ContactDeveloperForm } from "@/components/developers/contact-developer-form"
import { ExperienceTimeline } from "@/components/developers/experience-timeline"
import { PortfolioHero } from "@/components/developers/portfolio-hero"
import { PortfolioStats } from "@/components/developers/portfolio-stats"
import { ProjectsGrid } from "@/components/developers/projects-grid"
import { listExperienceByUserId } from "@/lib/db/repositories/experience"
import {
  getPublicProfileByUsername,
  listPublicUsernames,
} from "@/lib/db/repositories/profiles"
import { listProjectsByUserId } from "@/lib/db/repositories/projects"

export const revalidate = 60

type PageProps = {
  params: Promise<{ username: string }>
}

export async function generateStaticParams() {
  const usernames = await listPublicUsernames()
  return usernames.map((username) => ({ username }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfileByUsername(username)

  if (!profile) {
    return { title: "Portfolio | Portray" }
  }

  return {
    title: `${profile.displayName} | Portray`,
    description: profile.headline || profile.bio || undefined,
  }
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params
  const profile = await getPublicProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  const [projects, experience] = await Promise.all([
    listProjectsByUserId(profile.userId),
    listExperienceByUserId(profile.userId),
  ])

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-10">
        <PortfolioHero profile={profile} />
        <PortfolioStats userId={profile.userId} />
        <ExperienceTimeline experience={experience} />
        <ProjectsGrid projects={projects} username={profile.username} />
        <ContactDeveloperForm username={profile.username} />
        <p className="text-sm text-muted-foreground">
          <Link href="/developers" className="hover:underline">
            Back to developers
          </Link>
        </p>
      </div>
    </main>
  )
}
