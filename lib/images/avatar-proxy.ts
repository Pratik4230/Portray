const encoder = new TextEncoder()

export function encodeAvatarUrl(url: string) {
  const bytes = encoder.encode(url)
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export function decodeAvatarToken(token: string) {
  const padded = token.replace(/-/g, "+").replace(/_/g, "/")
  const padding = (4 - (padded.length % 4)) % 4
  const base64 = padded + "=".repeat(padding)
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function isPublicAvatarUrl(url: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }

  if (parsed.protocol !== "https:") return false

  const hostname = parsed.hostname.toLowerCase()
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  ) {
    return false
  }

  if (/^10\./.test(parsed.hostname)) return false
  if (/^192\.168\./.test(parsed.hostname)) return false
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(parsed.hostname)) return false

  return true
}
