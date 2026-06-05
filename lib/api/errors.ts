import { ZodError } from "zod"

import { fail } from "@/lib/api/response"

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super("UNAUTHORIZED", message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super("FORBIDDEN", message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super("NOT_FOUND", message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super("CONFLICT", message, 409)
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return fail(error.code, error.message, error.status, error.details)
  }

  if (error instanceof ZodError) {
    return fail("VALIDATION_ERROR", "Invalid request", 400, error.flatten())
  }

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: number }).code === 11000
  ) {
    return fail("CONFLICT", "Project slug already exists", 409)
  }

  console.error(error)
  return fail("INTERNAL_ERROR", "Something went wrong", 500)
}
