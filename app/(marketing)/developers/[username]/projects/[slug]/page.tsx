import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <Link
            href={`/developers/${username}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {profile.displayName}
          </Link>
          <h1 className="text-3xl font-medium tracking-tight">
            {project.title}
          </h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        {project.techStack.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}

        {project.longDescription ? (
          <Card>
            <CardHeader>
              <CardTitle>About this project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {project.longDescription}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {project.repoUrl || project.liveUrl ? (
          <Card size="sm">
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <CardDescription>Source code and live demo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {project.repoUrl ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    Repository
                  </Link>
                </Button>
              ) : null}
              {project.liveUrl ? (
                <Button asChild size="sm">
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    Live demo
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  )
}
