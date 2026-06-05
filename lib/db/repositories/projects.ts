import { connectDB } from "@/lib/db/client"
import { Project, type ProjectDocument } from "@/lib/db/models/project"
import { ConflictError, NotFoundError } from "@/lib/api/errors"
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/validations/project"
import type { ProjectDTO } from "@/types/project"

export function toProjectDTO(doc: ProjectDocument): ProjectDTO {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    longDescription: doc.longDescription || undefined,
    techStack: doc.techStack ?? [],
    repoUrl: doc.repoUrl || undefined,
    liveUrl: doc.liveUrl || undefined,
    featured: doc.featured ?? false,
    order: doc.order ?? 0,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  }
}

function emptyToUndefined(value?: string) {
  if (!value?.trim()) return undefined
  return value.trim()
}

export async function listProjectsByUserId(userId: string) {
  await connectDB()
  const docs = await Project.find({ userId }).sort({ order: 1, createdAt: -1 })
  return docs.map((doc) => toProjectDTO(doc))
}

export async function getProjectByUserIdAndSlug(userId: string, slug: string) {
  await connectDB()
  const doc = await Project.findOne({
    userId,
    slug: slug.toLowerCase(),
  })
  if (!doc) return null
  return toProjectDTO(doc)
}

export async function listPublicProjectParams() {
  await connectDB()
  const { Profile } = await import("@/lib/db/models/profile")
  const publicProfiles = await Profile.find({ isPublic: true }).select(
    "username userId",
  )

  const params: { username: string; slug: string }[] = []

  for (const profile of publicProfiles) {
    const projects = await Project.find({ userId: profile.userId }).select(
      "slug",
    )
    for (const project of projects) {
      params.push({ username: profile.username, slug: project.slug })
    }
  }

  return params
}

export async function getProjectByIdForUser(id: string, userId: string) {
  await connectDB()
  const doc = await Project.findOne({ _id: id, userId })
  if (!doc) {
    throw new NotFoundError("Project not found")
  }
  return toProjectDTO(doc)
}

export async function createProject(userId: string, input: CreateProjectInput) {
  await connectDB()

  const existing = await Project.exists({ userId, slug: input.slug })
  if (existing) {
    throw new ConflictError("You already have a project with this slug")
  }

  const doc = await Project.create({
    userId,
    slug: input.slug,
    title: input.title,
    description: input.description,
    longDescription: emptyToUndefined(input.longDescription),
    techStack: input.techStack,
    repoUrl: emptyToUndefined(input.repoUrl),
    liveUrl: emptyToUndefined(input.liveUrl),
    featured: input.featured ?? false,
    order: input.order ?? 0,
  })

  return toProjectDTO(doc)
}

export async function updateProject(
  id: string,
  userId: string,
  input: UpdateProjectInput,
) {
  await connectDB()

  const doc = await Project.findOne({ _id: id, userId })
  if (!doc) {
    throw new NotFoundError("Project not found")
  }

  if (input.slug && input.slug !== doc.slug) {
    const slugTaken = await Project.exists({
      userId,
      slug: input.slug,
      _id: { $ne: id },
    })
    if (slugTaken) {
      throw new ConflictError("You already have a project with this slug")
    }
  }

  if (input.title !== undefined) doc.title = input.title
  if (input.slug !== undefined) doc.slug = input.slug
  if (input.description !== undefined) doc.description = input.description
  if (input.longDescription !== undefined) {
    doc.longDescription = emptyToUndefined(input.longDescription)
  }
  if (input.techStack !== undefined) doc.techStack = input.techStack
  if (input.repoUrl !== undefined) doc.repoUrl = emptyToUndefined(input.repoUrl)
  if (input.liveUrl !== undefined) doc.liveUrl = emptyToUndefined(input.liveUrl)
  if (input.featured !== undefined) doc.featured = input.featured
  if (input.order !== undefined) doc.order = input.order

  await doc.save()
  return toProjectDTO(doc)
}

export async function deleteProject(id: string, userId: string) {
  await connectDB()
  const doc = await Project.findOneAndDelete({ _id: id, userId })
  if (!doc) {
    throw new NotFoundError("Project not found")
  }
  return toProjectDTO(doc)
}
