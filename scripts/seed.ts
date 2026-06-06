import { connectDB } from "@/lib/db/client"
import { ContactMessage } from "@/lib/db/models/contact-message"
import { Experience } from "@/lib/db/models/experience"
import { Profile } from "@/lib/db/models/profile"
import { Project } from "@/lib/db/models/project"
import { getAuth } from "@/lib/auth"
import { getMongoDb } from "@/lib/mongodb"
import { createProfileForUser } from "@/lib/profile/create-profile"
import { DEMO_PASSWORD, SEED_USERS, type SeedUser } from "@/scripts/seed-data"

async function findUserIdByEmail(email: string) {
  const db = await getMongoDb()
  const user = await db.collection("user").findOne({ email: email.toLowerCase() })
  return user?.id as string | undefined
}

async function verifyUserEmail(userId: string) {
  const db = await getMongoDb()
  await db.collection("user").updateOne(
    { id: userId },
    { $set: { emailVerified: true, updatedAt: new Date() } },
  )
}

async function ensureAuthUser(seed: SeedUser) {
  const existingByEmail = await findUserIdByEmail(seed.email)
  if (existingByEmail) {
    await verifyUserEmail(existingByEmail)
    return existingByEmail
  }

  const existingProfile = await Profile.findOne({ username: seed.username })
  if (existingProfile) {
    await verifyUserEmail(existingProfile.userId)
    return existingProfile.userId
  }

  const auth = await getAuth()
  await auth.api.signUpEmail({
    body: {
      name: seed.name,
      email: seed.email,
      password: DEMO_PASSWORD,
      username: seed.username,
    },
  })

  const userId = await findUserIdByEmail(seed.email)
  if (!userId) {
    throw new Error(`Failed to create auth user for ${seed.email}`)
  }

  await verifyUserEmail(userId)
  return userId
}

async function ensureProfile(userId: string, seed: SeedUser) {
  const profile =
    (await Profile.findOne({ userId })) ??
    (await Profile.findOne({ username: seed.username }))

  if (!profile) {
    await createProfileForUser({
      userId,
      name: seed.name,
      username: seed.username,
    })
  }

  await Profile.updateOne(
    { userId },
    {
      $set: {
        displayName: seed.name,
        headline: seed.headline,
        bio: seed.bio,
        location: seed.location,
        skills: seed.skills,
        socialLinks: seed.socialLinks,
        isPublic: true,
      },
    },
  )
}

async function seedUserData(userId: string, seed: SeedUser) {
  await Project.deleteMany({ userId })
  await Experience.deleteMany({ userId })
  await ContactMessage.deleteMany({ developerUserId: userId })

  if (seed.projects.length > 0) {
    await Project.insertMany(
      seed.projects.map((project) => ({
        userId,
        slug: project.slug,
        title: project.title,
        description: project.description,
        longDescription: project.longDescription,
        techStack: project.techStack,
        repoUrl: project.repoUrl,
        liveUrl: project.liveUrl,
        featured: project.featured ?? false,
        order: project.order,
      })),
    )
  }

  if (seed.experience.length > 0) {
    await Experience.insertMany(
      seed.experience.map((entry) => ({
        userId,
        company: entry.company,
        role: entry.role,
        startDate: entry.startDate,
        endDate: entry.endDate,
        description: entry.description,
        order: entry.order,
      })),
    )
  }

  if (seed.messages?.length) {
    await ContactMessage.insertMany(
      seed.messages.map((message) => ({
        developerUserId: userId,
        senderName: message.senderName,
        senderEmail: message.senderEmail,
        subject: message.subject,
        body: message.body,
        read: message.read ?? false,
      })),
    )
  }
}

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set. Use bun run seed with .env.local loaded.")
  }

  if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not set.")
  }

  await connectDB()

  console.log("Seeding Portray demo data...\n")

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"

  for (const seedUser of SEED_USERS) {
    const userId = await ensureAuthUser(seedUser)
    await ensureProfile(userId, seedUser)
    await seedUserData(userId, seedUser)

    console.log(`✓ ${seedUser.name} (@${seedUser.username})`)
    console.log(`  Login: ${seedUser.email} / ${DEMO_PASSWORD}`)
    console.log(`  Portfolio: ${siteUrl}/developers/${seedUser.username}\n`)
  }

  console.log("Done. Recruiters can browse /developers without an account.")
  console.log("Developers can sign in with the demo emails above.")
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
