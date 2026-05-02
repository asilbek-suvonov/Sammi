export function nowMs(): number {
  return Date.now()
}

export function msFromNow(ms: number): number {
  return nowMs() + ms
}

