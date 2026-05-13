const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const isHttps = typeof location !== 'undefined' && location.protocol === 'https:'

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const raw = parts.pop()?.split(';').shift()
    return raw ? decodeURIComponent(raw) : undefined
  }
  return undefined
}

export function setCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE
): void {
  if (typeof document === 'undefined') return
  // Secure flag on HTTPS; SameSite=Lax keeps redirects (OAuth) working while
  // still mitigating CSRF. httpOnly cannot be set from JS — the trade-off is
  // intentional: tokens belong in cookies so they ride with same-site
  // requests instead of being readable by every script via localStorage.
  const secure = isHttps ? '; Secure' : ''
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`
}

export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return
  const secure = isHttps ? '; Secure' : ''
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${secure}`
}
