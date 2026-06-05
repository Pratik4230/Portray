"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { AuthFormAlert, AuthFormField } from "@/components/auth/form-field"
import { AuthLink, AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get("email") ?? ""

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  const form = useForm({
    defaultValues: {
      email: initialEmail,
      otp: "",
      password: "",
    } satisfies ResetPasswordValues,
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      const { error } = await authClient.emailOtp.resetPassword({
        email: value.email,
        otp: value.otp,
        password: value.password,
      })

      if (error) {
        setSubmitError(error.message ?? "Could not reset password")
        return
      }

      router.push("/sign-in")
      router.refresh()
    },
  })

  async function resendCode(email: string) {
    if (!email) {
      setSubmitError("Enter your email")
      return
    }

    setSubmitError(null)
    setResending(true)

    const { error } = await authClient.emailOtp.requestPasswordReset({ email })

    setResending(false)

    if (error) {
      setSubmitError(error.message ?? "Could not resend code")
    }
  }

  return (
    <AuthShell
      title="Reset password"
      description="Enter the code from your email and a new password."
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
            <AuthFormField field={field} label="Email" type="email" />
          )}
        </form.Field>
        <form.Field name="otp">
          {(field) => (
            <AuthFormField
              field={field}
              label="Reset code"
              inputMode="numeric"
              maxLength={8}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <AuthFormField
              field={field}
              label="New password"
              type="password"
              autoComplete="new-password"
            />
          )}
        </form.Field>
        {submitError ? <AuthFormAlert message={submitError} /> : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset password"}
            </Button>
          )}
        </form.Subscribe>
        <form.Subscribe selector={(state) => state.values.email}>
          {(email) => (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={resending}
              onClick={() => void resendCode(email)}
            >
              {resending ? "Sending..." : "Resend code"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthShell>
  )
}
