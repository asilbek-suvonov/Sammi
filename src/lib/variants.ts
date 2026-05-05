export function levelVariant(level: string): 'secondary' | 'outline' | 'destructive' {
  const normalized = level?.toLowerCase()
  if (normalized === 'beginner') return 'secondary'
  if (normalized === 'advanced') return 'destructive'
  return 'outline'
}
