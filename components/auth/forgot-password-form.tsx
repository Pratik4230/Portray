"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { AuthFormAlert, AuthFormField } from "@/components/auth/form-field"
import { AuthLink, AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
    } satisfies ForgotPasswordValues,
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      const { error } = await authClient.emailOtp.requestPasswordReset({
        email: value.email,
      })

      if (error) {
        setSubmitError(error.message ?? "Could not send reset code")
        return
      }

      router.push(`/reset-password?email=${encodeURIComponent(value.email)}`)
    },
  })

  return (
    <AuthShell
      title="Forgot password"
      description="We will email you a code to reset your password."
      footer={<AuthLink href="/sign-in">Back to sign in</AuthLink>}
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
        {submitError ? <AuthFormAlert message={submitError} /> : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset code"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthShell>
  )
}
