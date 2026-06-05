export type ProjectDTO = {
  id: string
  userId: string
  slug: string
  title: string
  description: string
  longDescription?: string
  techStack: string[]
  repoUrl?: string
  liveUrl?: string
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiErrorBody = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}
