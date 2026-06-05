"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { ProjectFormDialog } from "@/components/dashboard/project-form-dialog"
import { ProjectDetailContent } from "@/components/projects/project-detail-content"
import { Button } from "@/components/ui/button"
import { fetchProfile } from "@/lib/api/profile-client"
import {
  deleteProjectRequest,
  fetchProject,
  updateProjectRequest,
} from "@/lib/api/projects-client"
import type { CreateProjectInput } from "@/lib/validations/project"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000"

export function ProjectDetail({ projectId }: { projectId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const projectQuery = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => fetchProject(projectId),
  })

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  })

  const saveMutation = useMutation({
    mutationFn: (values: CreateProjectInput) =>
      updateProjectRequest(projectId, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] })
      await queryClient.invalidateQueries({ queryKey: ["projects", projectId] })
      setDialogOpen(false)
      setActionError(null)
    },
    onError: (error: Error) => {
      setActionError(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteProjectRequest(projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] })
      router.push("/dashboard/projects")
    },
    onError: (error: Error) => {
      setActionError(error.message)
    },
  })

  if (projectQuery.isPending) {
    return <p className="text-muted-foreground">Loading project...</p>
  }

  if (projectQuery.isError) {
    return (
      <div className="space-y-3">
        <p className="text-destructive">{projectQuery.error.message}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/projects")}>
          Back to projects
        </Button>
      </div>
    )
  }

  const project = projectQuery.data
  const profile = profileQuery.data
  const publicHref =
    profile?.isPublic && profile.username
      ? `${siteUrl}/developers/${profile.username}/projects/${project.slug}`
      : undefined

  return (
    <>
      {actionError ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      <ProjectDetailContent
        project={project}
        backHref="/dashboard/projects"
        backLabel="All projects"
        publicHref={publicHref}
        actions={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (confirm("Delete this project?")) {
                  deleteMutation.mutate()
                }
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={project}
        onSubmit={async (values) => {
          setActionError(null)
          await saveMutation.mutateAsync(values)
        }}
        isSubmitting={saveMutation.isPending}
      />
    </>
  )
}
