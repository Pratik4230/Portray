import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { authUserAdditionalFields } from "@/lib/auth-user-fields"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  plugins: [
    emailOTPClient(),
    inferAdditionalFields({
      user: authUserAdditionalFields,
    }),
  ],
})
