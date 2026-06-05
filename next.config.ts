import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongodb", "mongoose", "better-auth", "better-auth/minimal"],
  images: {
    localPatterns: [
      {
        pathname: "/api/avatar/**",
      },
    ],
  },
}

export default nextConfig
