import { connectDB } from "@/lib/db/client"
import { Profile, type ProfileDocument } from "@/lib/db/models/profile"
import { NotFoundError } from "@/lib/api/errors"
import type { UpdateProfileInput } from "@/lib/validations/profile"
import type { ProfileDTO, PublicProfileDTO } from "@/types/profile"

export function toProfileDTO(doc: ProfileDocument): ProfileDTO {
  return {
    ...toPublicProfileDTO(doc),
    isPublic: doc.isPublic ?? false,
  }
}

export function toPublicProfileDTO(doc: ProfileDocument): PublicProfileDTO {
  const social = doc.socialLinks ?? {}

  return {
    id: doc._id.toString(),
    userId: doc.userId,
    username: doc.username,
    displayName: doc.displayName,
    headline: doc.headline ?? "",
    bio: doc.bio ?? "",
    avatarUrl: doc.avatarUrl || undefined,
    location: doc.location || undefined,
    skills: doc.skills ?? [],
    socialLinks: {
      github: social.github || undefined,
      linkedin: social.linkedin || undefined,
      x: social.x || undefined,
      website: social.website || undefined,
    },
  }
}

export async function listPublicProfiles(query?: string) {
  await connectDB()

  const filter: Record<string, unknown> = { isPublic: true }

  if (query?.trim()) {
    const term = query.trim()
    filter.$or = [
      { displayName: { $regex: term, $options: "i" } },
      { username: { $regex: term, $options: "i" } },
      { headline: { $regex: term, $options: "i" } },
      { skills: { $elemMatch: { $regex: term, $options: "i" } } },
    ]
  }

  const docs = await Profile.find(filter).sort({ displayName: 1 })
  return docs.map((doc) => toPublicProfileDTO(doc))
}

export async function listFeaturedPublicProfiles(limit = 3) {
  await connectDB()
  const docs = await Profile.find({ isPublic: true })
    .sort({ updatedAt: -1 })
    .limit(limit)
  return docs.map((doc) => toPublicProfileDTO(doc))
}

export async function listPublicUsernames() {
  await connectDB()
  const docs = await Profile.find({ isPublic: true }).select("username")
  return docs.map((doc) => doc.username)
}

export async function getPublicProfileByUsername(username: string) {
  await connectDB()
  const doc = await Profile.findOne({
    username: username.toLowerCase(),
    isPublic: true,
  })
  if (!doc) return null
  return toPublicProfileDTO(doc)
}

export async function getProfileUsernameByUserId(userId: string) {
  await connectDB()
  const doc = await Profile.findOne({ userId }).select("username isPublic")
  if (!doc) return null
  return { username: doc.username, isPublic: doc.isPublic ?? false }
}

export async function getProfileByUserId(userId: string) {
  await connectDB()
  const doc = await Profile.findOne({ userId })
  if (!doc) {
    throw new NotFoundError("Profile not found")
  }
  return toProfileDTO(doc)
}

function emptyToUndefined(value?: string) {
  if (!value?.trim()) return undefined
  return value.trim()
}

export async function updateProfileForUser(
  userId: string,
  input: UpdateProfileInput,
) {
  await connectDB()

  const doc = await Profile.findOne({ userId })
  if (!doc) {
    throw new NotFoundError("Profile not found")
  }

  const previous = {
    username: doc.username,
    isPublic: doc.isPublic ?? false,
  }

  if (input.displayName !== undefined) doc.displayName = input.displayName.trim()
  if (input.headline !== undefined) doc.headline = input.headline.trim()
  if (input.bio !== undefined) doc.bio = input.bio.trim()
  if (input.avatarUrl !== undefined) {
    doc.avatarUrl = emptyToUndefined(input.avatarUrl)
  }
  if (input.location !== undefined) {
    doc.location = emptyToUndefined(input.location)
  }
  if (input.skills !== undefined) doc.skills = input.skills
  if (input.socialLinks !== undefined) {
    doc.socialLinks = {
      github: emptyToUndefined(input.socialLinks.github),
      linkedin: emptyToUndefined(input.socialLinks.linkedin),
      x: emptyToUndefined(input.socialLinks.x),
      website: emptyToUndefined(input.socialLinks.website),
    }
  }
  if (input.isPublic !== undefined) doc.isPublic = input.isPublic

  await doc.save()

  return {
    profile: toProfileDTO(doc),
    previous,
  }
}
