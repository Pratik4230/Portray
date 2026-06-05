import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProjectDetailContent } from "@/components/projects/project-detail-content"
import { getPublicProfileByUsername } from "@/lib/db/repositories/profiles"
import {
  getProjectByUserIdAndSlug,
  listPublicProjectParams,
} from "@/lib/db/repositories/projects"

export const revalidate = 60

type PageProps = {
  params: Promise<{ username: string; slug: string }>
}

export async function generateStaticParams() {
  return listPublicProjectParams()
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username, slug } = await params
  const profile = await getPublicProfileByUsername(username)
  if (!profile) return { title: "Project | Portray" }

  const project = await getProjectByUserIdAndSlug(profile.userId, slug)
  if (!project) return { title: "Project | Portray" }

  return {
    title: `${project.title} · ${profile.displayName} | Portray`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { username, slug } = await params
  const profile = await getPublicProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  const project = await getProjectByUserIdAndSlug(profile.userId, slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <ProjectDetailContent
          project={project}
          backHref={`/developers/${username}`}
          backLabel={profile.displayName}
        />
      </div>
    </main>
  )
}
