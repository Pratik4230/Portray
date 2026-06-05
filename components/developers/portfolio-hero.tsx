import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import type { PublicProfileDTO } from "@/types/profile"
import Image from "next/image"

function ProfileAvatar({
  displayName,
  avatarUrl,
}: {
  displayName: string
  avatarUrl?: string
}) {
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={displayName}
        className="size-24 rounded-full object-cover ring-1 ring-foreground/10"
      />
    )
  }

  return (
    <div className="flex size-24 items-center justify-center rounded-full bg-muted text-2xl font-medium">
      {initials}
    </div>
  )
}

export function PortfolioHero({ profile }: { profile: PublicProfileDTO }) {
  const { socialLinks } = profile

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <ProfileAvatar
          displayName={profile.displayName}
          avatarUrl={profile.avatarUrl}
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-medium tracking-tight">
            {profile.displayName}
          </h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          {profile.headline ? (
            <p className="text-lg">{profile.headline}</p>
          ) : null}
          {profile.location ? (
            <p className="text-sm text-muted-foreground">{profile.location}</p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-1">
            {socialLinks.github ? (
              <Link
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                GitHub
              </Link>
            ) : null}
            {socialLinks.linkedin ? (
              <Link
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                LinkedIn
              </Link>
            ) : null}
            {socialLinks.website ? (
              <Link
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                Website
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      {profile.bio ? (
        <p className="max-w-2xl text-muted-foreground">{profile.bio}</p>
      ) : null}
      {profile.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      ) : null}
    </section>
  )
}
