import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { PublicProfileDTO } from "@/types/profile"
import Image from "next/image";

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
        width={48}
        height={48}
        src={avatarUrl}
        alt={displayName}
        className="size-12 rounded-full object-cover ring-1 ring-foreground/10"
      />
    )
  }

  return (
    <div className="flex size-12 items-center justify-center rounded-full bg-muted text-sm font-medium">
      {initials}
    </div>
  )
}

export function DeveloperCard({ profile }: { profile: PublicProfileDTO }) {
  return (
    <Link href={`/developers/${profile.username}`}>
      <Card className="h-full transition-colors hover:bg-muted/30">
        <CardHeader className="flex flex-row items-start gap-4">
          <ProfileAvatar
            displayName={profile.displayName}
            avatarUrl={profile.avatarUrl}
          />
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{profile.displayName}</CardTitle>
            <CardDescription className="truncate">
              @{profile.username}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile.headline ? (
            <p className="line-clamp-2 text-muted-foreground">
              {profile.headline}
            </p>
          ) : null}
          {profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {profile.skills.length > 4 ? (
                <Badge variant="outline">+{profile.skills.length - 4}</Badge>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  )
}
