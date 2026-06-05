import { connectDB } from "@/lib/db/client"
import { Profile } from "@/lib/db/models/profile"
import { normalizeUsername } from "@/lib/validations/username"

export async function isUsernameTaken(username: string) {
  await connectDB()
  const normalized = normalizeUsername(username)
  const existing = await Profile.exists({ username: normalized })
  return Boolean(existing)
}

export async function createProfileForUser({
  userId,
  name,
  username,
}: {
  userId: string
  name: string
  username: string
}) {
  await connectDB()

  const existing = await Profile.findOne({ userId }).lean()
  if (existing) {
    return existing
  }

  const normalized = normalizeUsername(username)

  if (await isUsernameTaken(normalized)) {
    throw new Error("Username is already taken")
  }

  return Profile.create({
    userId,
    username: normalized,
    displayName: name.trim() || normalized,
    headline: "",
    bio: "",
    skills: [],
    socialLinks: {},
    isPublic: false,
  })
}
