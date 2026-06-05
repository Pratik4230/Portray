"use client"

import Image from "next/image"
import { useState } from "react"

import {
  encodeAvatarUrl,
  isPublicAvatarUrl,
} from "@/lib/images/avatar-proxy"
import { cn } from "@/lib/utils"

type ProfileAvatarProps = {
  displayName: string
  avatarUrl?: string
  size?: "sm" | "lg"
}

const pixelSizes = {
  sm: 48,
  lg: 96,
} as const

const sizeClasses = {
  sm: "size-12 text-sm",
  lg: "size-24 text-2xl",
}

export function ProfileAvatar({
  displayName,
  avatarUrl,
  size = "sm",
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false)

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const pixels = pixelSizes[size]
  const showImage =
    avatarUrl && isPublicAvatarUrl(avatarUrl) && !imageError

  if (showImage) {
    const src = `/api/avatar/${encodeAvatarUrl(avatarUrl)}`

    return (
      <Image
        src={src}
        alt={displayName}
        width={pixels}
        height={pixels}
        loading={size === "lg" ? "eager" : "lazy"}
        className={cn(
          "rounded-full object-cover ring-1 ring-foreground/10",
          sizeClasses[size],
        )}
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-muted font-medium",
        sizeClasses[size],
      )}
    >
      {initials}
    </div>
  )
}
