export function levelVariant(level: string): 'secondary' | 'outline' | 'destructive' {
  if (level === 'Beginner') return 'secondary'
  if (level === 'Advanced') return 'destructive'
  return 'outline'
}
