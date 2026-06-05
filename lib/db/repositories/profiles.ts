import { connectDB } from "@/lib/db/client"
import { Profile, type ProfileDocument } from "@/lib/db/models/profile"
import type { PublicProfileDTO } from "@/types/profile"

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
