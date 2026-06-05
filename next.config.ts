import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongodb", "mongoose", "better-auth", "better-auth/minimal"],
}

export default nextConfig
