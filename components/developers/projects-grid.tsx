import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProjectDTO } from "@/types/project"

export function ProjectsGrid({
  projects,
  username,
}: {
  projects: ProjectDTO[]
  username: string
}) {
  if (projects.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium tracking-tight">Projects</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/developers/${username}/projects/${project.slug}`}
          >
            <Card className="h-full transition-colors hover:bg-muted/30">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{project.title}</CardTitle>
                  {project.featured ? (
                    <Badge variant="outline">Featured</Badge>
                  ) : null}
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              {project.techStack.length > 0 ? (
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              ) : null}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
