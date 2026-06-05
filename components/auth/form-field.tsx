"use client"

import type { AnyFieldApi } from "@tanstack/react-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function fieldErrorMessage(errors: unknown[]) {
  const first = errors[0]
  if (!first) return null
  if (typeof first === "string") return first
  if (typeof first === "object" && first !== null && "message" in first) {
    return String((first as { message: unknown }).message)
  }
  return "Invalid value"
}

export function AuthFormField({
  field,
  label,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: {
  field: AnyFieldApi
  label: string
  type?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  maxLength?: number
}) {
  const error = fieldErrorMessage(field.state.meta.errors)

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={String(field.state.value ?? "")}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        className={cn(error && "border-destructive")}
      />
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function AuthFormAlert({
  message,
  variant = "error",
}: {
  message: string
  variant?: "error" | "success"
}) {
  return (
    <p
      className={cn(
        "text-sm",
        variant === "error" ? "text-destructive" : "text-muted-foreground",
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  )
}
