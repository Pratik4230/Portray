import { betterAuth } from "better-auth/minimal"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import { emailOTP } from "better-auth/plugins"
import { APIError } from "better-auth/api"

import { authUserAdditionalFields } from "@/lib/auth-user-fields"
import { sendOtpEmail } from "@/lib/email/send-otp"
import { getMongoClient, getMongoDb } from "@/lib/mongodb"
import { createProfileForUser, isUsernameTaken } from "@/lib/profile/create-profile"
import { normalizeUsername, usernameSchema } from "@/lib/validations/username"

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL

let authInstance: Awaited<ReturnType<typeof buildAuth>> | undefined

async function buildAuth() {
  const db = await getMongoDb()
  const client = await getMongoClient()

  return betterAuth({
    appName: "Portray",
    baseURL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(db, {
      client,
      transaction: false,
    }),
    user: {
      additionalFields: authUserAdditionalFields,
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      autoSignIn: false,
    },
    emailVerification: {
      autoSignInAfterVerification: true,
    },
    plugins: [
      emailOTP({
        overrideDefaultEmailVerification: true,
        sendVerificationOnSignUp: true,
        async sendVerificationOTP({ email, otp, type }) {
          sendOtpEmail({ email, otp, type })
        },
      }),
      nextCookies(),
    ],
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const raw = (user as { username?: string }).username ?? ""
            const username = normalizeUsername(raw)

            if (!usernameSchema.safeParse(username).success) {
              throw new APIError("BAD_REQUEST", {
                message: "Choose a valid username (3–24 chars, lowercase, numbers, hyphens)",
              })
            }

            if (await isUsernameTaken(username)) {
              throw new APIError("CONFLICT", {
                message: "Username is already taken",
              })
            }

            return {
              data: {
                ...user,
                username,
              },
            }
          },
          after: async (user) => {
            const username = normalizeUsername(
              String((user as { username?: string }).username ?? ""),
            )

            await createProfileForUser({
              userId: user.id,
              name: user.name,
              username,
            })
          },
        },
      },
    },
  })
}

export async function getAuth() {
  if (!authInstance) {
    authInstance = await buildAuth()
  }
  return authInstance
}
