import Link from "next/link"
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
import type { ProjectDTO } from "@/types/project"

type ProjectDetailContentProps = {
  project: ProjectDTO
  backHref?: string
  backLabel?: string
  actions?: React.ReactNode
  publicHref?: string
}

export function ProjectDetailContent({
  project,
  backHref,
  backLabel,
  actions,
  publicHref,
}: ProjectDetailContentProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {backHref && backLabel ? (
          <Link
            href={backHref}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {backLabel}
          </Link>
        ) : null}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-medium tracking-tight">
                {project.title}
              </h1>
              {project.featured ? <Badge>Featured</Badge> : null}
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        {publicHref ? (
          <p className="text-sm text-muted-foreground">
            Public URL:{" "}
            <Link
              href={publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {publicHref.replace(/^https?:\/\/[^/]+/, "")}
            </Link>
          </p>
        ) : null}
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
  )
}
