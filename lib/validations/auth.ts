import { z } from "zod"

import { usernameSchema } from "@/lib/validations/username"

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: usernameSchema,
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const verifyEmailSchema = z.object({
  email: z.email("Enter a valid email"),
  otp: z.string().min(4, "Enter the code from your email"),
})

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
})

export const resetPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
  otp: z.string().min(4, "Enter the code from your email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type SignUpValues = z.infer<typeof signUpSchema>
export type SignInValues = z.infer<typeof signInSchema>
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
