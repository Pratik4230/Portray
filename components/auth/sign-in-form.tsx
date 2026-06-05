"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { AuthFormAlert, AuthFormField } from "@/components/auth/form-field"
import { AuthLink, AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { signInSchema, type SignInValues } from "@/lib/validations/auth"

export function SignInForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies SignInValues,
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      })

      if (error) {
        if (error.status === 403) {
          router.push(`/verify-email?email=${encodeURIComponent(value.email)}`)
          return
        }
        setSubmitError(error.message ?? "Sign in failed")
        return
      }

      router.push("/dashboard")
      router.refresh()
    },
  })

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to manage your Portray portfolio."
      footer={
        <>
          No account? <AuthLink href="/sign-up">Sign up</AuthLink>
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
              autoComplete="current-password"
            />
          )}
        </form.Field>
        <div className="text-right text-sm">
          <AuthLink href="/forgot-password">Forgot password?</AuthLink>
        </div>
        {submitError ? <AuthFormAlert message={submitError} /> : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthShell>
  )
}
