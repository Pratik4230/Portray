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
  createExperienceSchema,
  type CreateExperienceInput,
} from "@/lib/validations/experience"
import type { ExperienceDTO } from "@/types/experience"

type ExperienceFormValues = {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
  order: number
}

type ExperienceFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: ExperienceDTO | null
  onSubmit: (values: CreateExperienceInput) => Promise<void>
  isSubmitting?: boolean
}

const emptyValues: ExperienceFormValues = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  order: 0,
}

export function ExperienceFormDialog({
  open,
  onOpenChange,
  entry,
  onSubmit,
  isSubmitting,
}: ExperienceFormDialogProps) {
  const isEdit = Boolean(entry)

  const form = useForm({
    defaultValues: emptyValues,
    onSubmit: async ({ value }) => {
      const parsed = createExperienceSchema.parse({
        ...value,
        endDate: value.endDate || null,
      })
      await onSubmit(parsed)
    },
  })

  useEffect(() => {
    if (!open) return

    if (entry) {
      form.reset({
        company: entry.company,
        role: entry.role,
        startDate: entry.startDate,
        endDate: entry.endDate ?? "",
        description: entry.description,
        order: entry.order,
      })
      return
    }

    form.reset(emptyValues)
  }, [open, entry, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit experience" : "Add experience"}
          </DialogTitle>
          <DialogDescription>
            Add roles to your public portfolio timeline.
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
          <form.Field name="company">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="role">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="startDate">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Jan 2022"
                />
              </div>
            )}
          </form.Field>
          <form.Field name="endDate">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input
                  id="endDate"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Present (leave empty)"
                />
              </div>
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="order">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="order">Sort order</Label>
                <Input
                  id="order"
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value) || 0)
                  }
                />
              </div>
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
