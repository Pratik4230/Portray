import {
  decodeAvatarToken,
  isPublicAvatarUrl,
} from "@/lib/images/avatar-proxy"

type RouteContext = {
  params: Promise<{ token: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params

  let avatarUrl: string
  try {
    avatarUrl = decodeAvatarToken(token)
  } catch {
    return new Response("Invalid token", { status: 400 })
  }

  if (!isPublicAvatarUrl(avatarUrl)) {
    return new Response("Invalid avatar URL", { status: 400 })
  }

  const upstream = await fetch(avatarUrl, {
    signal: AbortSignal.timeout(8000),
    headers: {
      Accept: "image/*",
    },
  })

  if (!upstream.ok) {
    return new Response("Failed to fetch avatar", { status: 502 })
  }

  const contentType = upstream.headers.get("content-type") ?? ""
  if (!contentType.startsWith("image/")) {
    return new Response("Not an image", { status: 400 })
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
}
