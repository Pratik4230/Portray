"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { ExperienceFormDialog } from "@/components/dashboard/experience-form-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  createExperienceRequest,
  deleteExperienceRequest,
  fetchExperience,
  updateExperienceRequest,
} from "@/lib/api/experience-client"
import type { CreateExperienceInput } from "@/lib/validations/experience"
import type { ExperienceDTO } from "@/types/experience"

function formatDateRange(startDate: string, endDate: string | null) {
  if (endDate) {
    return `${startDate} – ${endDate}`
  }
  return `${startDate} – Present`
}

export function ExperienceManager() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ExperienceDTO | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const experienceQuery = useQuery({
    queryKey: ["experience"],
    queryFn: fetchExperience,
  })

  const saveMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id?: string
      values: CreateExperienceInput
    }) => {
      if (id) {
        return updateExperienceRequest(id, values)
      }
      return createExperienceRequest(values)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["experience"] })
      setDialogOpen(false)
      setEditingEntry(null)
      setActionError(null)
    },
    onError: (error: Error) => {
      setActionError(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExperienceRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["experience"] })
      setActionError(null)
    },
    onError: (error: Error) => {
      setActionError(error.message)
    },
  })

  function openCreate() {
    setEditingEntry(null)
    setActionError(null)
    setDialogOpen(true)
  }

  function openEdit(entry: ExperienceDTO) {
    setEditingEntry(entry)
    setActionError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(values: CreateExperienceInput) {
    setActionError(null)
    await saveMutation.mutateAsync({
      id: editingEntry?.id,
      values,
    })
  }

  const entries = experienceQuery.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">Experience</h1>
          <p className="text-sm text-muted-foreground">
            Manage your work history shown on your public portfolio.
          </p>
        </div>
        <Button onClick={openCreate}>Add experience</Button>
      </div>

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      {experienceQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading experience...</p>
      ) : null}

      {experienceQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {(experienceQuery.error as Error).message}
        </p>
      ) : null}

      {!experienceQuery.isLoading && entries.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No experience entries yet. Add your first role to build your
            timeline.
          </p>
          <Button className="mt-4" onClick={openCreate}>
            Add experience
          </Button>
        </div>
      ) : null}

      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} size="sm">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>{entry.role}</CardTitle>
                  <CardDescription>
                    {entry.company} ·{" "}
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </CardDescription>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(entry)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (confirm("Delete this experience entry?")) {
                        deleteMutation.mutate(entry.id)
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              {entry.description ? (
                <CardContent>
                  <p className="text-muted-foreground">{entry.description}</p>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      ) : null}

      <ExperienceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        onSubmit={handleSubmit}
        isSubmitting={saveMutation.isPending}
      />
    </div>
  )
}
