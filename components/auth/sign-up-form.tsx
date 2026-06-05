"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { AuthFormAlert, AuthFormField } from "@/components/auth/form-field"
import { AuthLink, AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth"
import { normalizeUsername, usernameSchema } from "@/lib/validations/username"

async function checkUsernameAvailable(username: string) {
  const normalized = normalizeUsername(username)
  if (!usernameSchema.safeParse(normalized).success) {
    return "Invalid username format"
  }

  const response = await fetch(
    `/api/username/available?username=${encodeURIComponent(normalized)}`
  )
  const json = (await response.json()) as {
    data?: { available?: boolean }
  }

  if (!json.data?.available) {
    return "Username is already taken"
  }

  return undefined
}

export function SignUpForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    } satisfies SignUpValues,
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      const { error } = await authClient.signUp.email({
        name: value.name,
        username: normalizeUsername(value.username),
        email: value.email,
        password: value.password,
      })

      if (error) {
        setSubmitError(error.message ?? "Sign up failed")
        return
      }

      router.push(`/verify-email?email=${encodeURIComponent(value.email)}`)
    },
  })

  return (
    <AuthShell
      title="Create your account"
      description="Pick a username for your public portfolio URL."
      footer={
        <>
          Already have an account? <AuthLink href="/sign-in">Sign in</AuthLink>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field name="name">
          {(field) => (
            <AuthFormField field={field} label="Name" autoComplete="name" />
          )}
        </form.Field>
        <form.Field
          name="username"
          validators={{
            onChange: usernameSchema,
            onChangeAsyncDebounceMs: 700,
            onChangeAsync: async ({ value }) => checkUsernameAvailable(value),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <AuthFormField
                field={field}
                label="Username"
                autoComplete="username"
              />
              <form.Subscribe selector={(state) => state.values.username}>
                {(username) =>
                  username ? (
                    <p className="text-xs text-muted-foreground">
                      /developers/{normalizeUsername(username)}
                    </p>
                  ) : null
                }
              </form.Subscribe>
            </div>
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <AuthFormField
              field={field}
              label="Email"
              type="email"
              autoComplete="email"
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <AuthFormField
              field={field}
              label="Password"
              type="password"
              autoComplete="new-password"
            />
          )}
        </form.Field>
        {submitError ? <AuthFormAlert message={submitError} /> : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign up"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthShell>
  )
}
