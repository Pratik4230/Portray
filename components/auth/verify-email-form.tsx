"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { AuthFormAlert, AuthFormField } from "@/components/auth/form-field"
import { AuthLink, AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { verifyEmailSchema, type VerifyEmailValues } from "@/lib/validations/auth"

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get("email") ?? ""

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  const form = useForm({
    defaultValues: {
      email: initialEmail,
      otp: "",
    } satisfies VerifyEmailValues,
    validators: {
      onSubmit: verifyEmailSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      const { error } = await authClient.emailOtp.verifyEmail({
        email: value.email,
        otp: value.otp,
      })

      if (error) {
        setSubmitError(error.message ?? "Invalid or expired code")
        return
      }

      router.push("/dashboard")
      router.refresh()
    },
  })

  async function sendCode(email: string) {
    if (!email) {
      setSubmitError("Enter your email")
      return
    }

    setSubmitError(null)
    setResending(true)

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    })

    setResending(false)

    if (error) {
      setSubmitError(error.message ?? "Could not send code")
      return
    }

    setSubmitError(null)
  }

  return (
    <AuthShell
      title="Verify your email"
      description="Enter the code we sent when you signed up. Use resend if you need a new one."
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
        <form.Field name="otp">
          {(field) => (
            <AuthFormField
              field={field}
              label="Verification code"
              inputMode="numeric"
              maxLength={8}
            />
          )}
        </form.Field>
        {submitError ? <AuthFormAlert message={submitError} /> : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify and continue"}
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
              onClick={() => void sendCode(email)}
            >
              {resending ? "Sending..." : "Resend code"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthShell>
  )
}
