"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { fetchProfile, updateProfileRequest } from "@/lib/api/profile-client"
import { updateProfileSchema } from "@/lib/validations/profile"
import type { ProfileDTO } from "@/types/profile"

type ProfileFormValues = {
  displayName: string
  headline: string
  bio: string
  avatarUrl: string
  location: string
  skills: string
  github: string
  linkedin: string
  x: string
  website: string
  isPublic: boolean
}

function profileToFormValues(profile: ProfileDTO): ProfileFormValues {
  return {
    displayName: profile.displayName,
    headline: profile.headline,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl ?? "",
    location: profile.location ?? "",
    skills: profile.skills.join(", "),
    github: profile.socialLinks.github ?? "",
    linkedin: profile.socialLinks.linkedin ?? "",
    x: profile.socialLinks.x ?? "",
    website: profile.socialLinks.website ?? "",
    isPublic: profile.isPublic,
  }
}

const emptyValues: ProfileFormValues = {
  displayName: "",
  headline: "",
  bio: "",
  avatarUrl: "",
  location: "",
  skills: "",
  github: "",
  linkedin: "",
  x: "",
  website: "",
  isPublic: false,
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000"

export function ProfileEditor() {
  const queryClient = useQueryClient()
  const [actionError, setActionError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  })

  const saveMutation = useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      setActionError(null)
      setSaved(true)
    },
    onError: (error: Error) => {
      setActionError(error.message)
      setSaved(false)
    },
  })

  const form = useForm({
    defaultValues: emptyValues,
    onSubmit: async ({ value }) => {
      setActionError(null)
      setSaved(false)

      const parsed = updateProfileSchema.parse({
        displayName: value.displayName,
        headline: value.headline,
        bio: value.bio,
        avatarUrl: value.avatarUrl || undefined,
        location: value.location || undefined,
        skills: value.skills,
        socialLinks: {
          github: value.github || undefined,
          linkedin: value.linkedin || undefined,
          x: value.x || undefined,
          website: value.website || undefined,
        },
        isPublic: value.isPublic,
      })

      await saveMutation.mutateAsync(parsed)
    },
  })

  useEffect(() => {
    if (profileQuery.data) {
      form.reset(profileToFormValues(profileQuery.data))
    }
  }, [profileQuery.data, form])

  if (profileQuery.isPending) {
    return <p className="text-muted-foreground">Loading profile...</p>
  }

  if (profileQuery.isError) {
    return (
      <p className="text-destructive">
        {profileQuery.error.message || "Failed to load profile"}
      </p>
    )
  }

  const profile = profileQuery.data
  const publicUrl = `${siteUrl}/developers/${profile.username}`

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium">Profile</h1>
        <p className="text-muted-foreground">
          Your public portfolio at{" "}
          <span className="font-medium text-foreground">
            /developers/{profile.username}
          </span>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="max-w-xl space-y-6"
      >
        <div className="space-y-2">
          <Label>Username</Label>
          <Input value={profile.username} disabled />
          <p className="text-xs text-muted-foreground">
            Set when you signed up. Your portfolio URL uses this handle.
          </p>
        </div>

        <form.Field name="displayName">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="headline">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Full-stack developer"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="bio">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="avatarUrl">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}
        </form.Field>

        <form.Field name="location">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="skills">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="TypeScript, React, MongoDB"
              />
            </div>
          )}
        </form.Field>

        <div className="space-y-4">
          <h2 className="text-sm font-medium">Social links</h2>
          <form.Field name="github">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="linkedin">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="x">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="x">X</Label>
                <Input
                  id="x"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="website">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="isPublic">
          {(field) => (
            <div className="space-y-2 rounded-lg border p-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                Make portfolio public
              </label>
              <p className="text-xs text-muted-foreground">
                When enabled, recruiters can find you on the developers directory
                and view your portfolio.
              </p>
              {field.state.value ? (
                <p className="text-sm">
                  <Link
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    View public portfolio
                  </Link>
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {actionError ? (
          <p className="text-sm text-destructive">{actionError}</p>
        ) : null}
        {saved ? (
          <p className="text-sm text-muted-foreground">Profile saved.</p>
        ) : null}

        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </div>
  )
}
