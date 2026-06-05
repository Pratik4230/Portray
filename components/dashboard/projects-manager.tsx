"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"

import { ProjectFormDialog } from "@/components/dashboard/project-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  createProjectRequest,
  deleteProjectRequest,
  fetchProjects,
  updateProjectRequest,
} from "@/lib/api/projects-client"
import type { CreateProjectInput } from "@/lib/validations/project"
import type { ProjectDTO } from "@/types/project"

export function ProjectsManager() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectDTO | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  })

  const saveMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id?: string
      values: CreateProjectInput
    }) => {
      if (id) {
        return updateProjectRequest(id, values)
      }
      return createProjectRequest(values)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] })
      setDialogOpen(false)
      setEditingProject(null)
      setActionError(null)
    },
    onError: (error: Error) => {
      setActionError(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProjectRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] })
      setActionError(null)
    },
    onError: (error: Error) => {
      setActionError(error.message)
    },
  })

  function openCreate() {
    setEditingProject(null)
    setActionError(null)
    setDialogOpen(true)
  }

  function openEdit(project: ProjectDTO) {
    setEditingProject(project)
    setActionError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(values: CreateProjectInput) {
    setActionError(null)
    await saveMutation.mutateAsync({
      id: editingProject?.id,
      values,
    })
  }

  const projects = projectsQuery.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage portfolio projects via REST API and TanStack Query.
          </p>
        </div>
        <Button onClick={openCreate}>Add project</Button>
      </div>

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      {projectsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading projects...</p>
      ) : null}

      {projectsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {(projectsQuery.error as Error).message}
        </p>
      ) : null}

      {!projectsQuery.isLoading && projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No projects yet. Add your first one to showcase your work.
          </p>
          <Button className="mt-4" onClick={openCreate}>
            Add project
          </Button>
        </div>
      ) : null}

      {projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-lg border bg-card p-4 shadow-xs transition-colors hover:bg-muted/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="min-w-0 flex-1 space-y-1"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{project.title}</h2>
                    {project.featured ? <Badge>Featured</Badge> : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    /developers/you/projects/{project.slug}
                  </p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </Link>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (confirm("Delete this project?")) {
                        deleteMutation.mutate(project.id)
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {project.techStack.length > 0 ? (
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSubmit={handleSubmit}
        isSubmitting={saveMutation.isPending}
      />
    </div>
  )
}
