export type SocialLinks = {
  github?: string
  linkedin?: string
  x?: string
  website?: string
}

export type PublicProfileDTO = {
  id: string
  userId: string
  username: string
  displayName: string
  headline: string
  bio: string
  avatarUrl?: string
  location?: string
  skills: string[]
  socialLinks: SocialLinks
}
