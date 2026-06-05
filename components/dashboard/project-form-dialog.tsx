"use client"

import { useForm } from "@tanstack/react-form"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createProjectSchema,
  slugFromTitle,
  type CreateProjectInput,
} from "@/lib/validations/project"
import type { ProjectDTO } from "@/types/project"

type ProjectFormValues = {
  title: string
  slug: string
  description: string
  longDescription: string
  techStack: string
  repoUrl: string
  liveUrl: string
  featured: boolean
  order: number
}

type ProjectFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: ProjectDTO | null
  onSubmit: (values: CreateProjectInput) => Promise<void>
  isSubmitting?: boolean
}

const emptyValues: ProjectFormValues = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  techStack: "",
  repoUrl: "",
  liveUrl: "",
  featured: false,
  order: 0,
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSubmit,
  isSubmitting,
}: ProjectFormDialogProps) {
  const isEdit = Boolean(project)

  const form = useForm({
    defaultValues: emptyValues,
    onSubmit: async ({ value }) => {
      const parsed = createProjectSchema.parse({
        ...value,
        techStack: value.techStack,
      })
      await onSubmit(parsed)
    },
  })

  useEffect(() => {
    if (!open) return

    if (project) {
      form.reset({
        title: project.title,
        slug: project.slug,
        description: project.description,
        longDescription: project.longDescription ?? "",
        techStack: project.techStack.join(", "),
        repoUrl: project.repoUrl ?? "",
        liveUrl: project.liveUrl ?? "",
        featured: project.featured,
        order: project.order,
      })
      return
    }

    form.reset(emptyValues)
  }, [open, project, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit project" : "Add project"}</DialogTitle>
          <DialogDescription>
            Showcase your work on your public Portray portfolio.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="title">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const title = e.target.value
                    field.handleChange(title)
                    if (!isEdit) {
                      form.setFieldValue("slug", slugFromTitle(title))
                    }
                  }}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="slug">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="description">Short description</Label>
                <Textarea
                  id="description"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="longDescription">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="longDescription">Long description</Label>
                <Textarea
                  id="longDescription"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="techStack">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="techStack">Tech stack</Label>
                <Input
                  id="techStack"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Next.js, MongoDB, TypeScript"
                />
              </div>
            )}
          </form.Field>
          <form.Field name="repoUrl">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="repoUrl">Repository URL</Label>
                <Input
                  id="repoUrl"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="liveUrl">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="featured">
            {(field) => (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                Featured project
              </label>
            )}
          </form.Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
