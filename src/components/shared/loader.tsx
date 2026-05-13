import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <Loader2
      aria-hidden='true'
      className={cn(
        'animate-spin text-muted-foreground',
        SIZE_MAP[size],
        className
      )}
    />
  )
}

interface PageLoaderProps {
  fullScreen?: boolean
  className?: string
  label?: string
}

export function PageLoader({
  fullScreen = false,
  className,
  label,
}: PageLoaderProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      className={cn(
        'flex w-full items-center justify-center gap-2 text-sm text-muted-foreground',
        fullScreen ? 'min-h-svh' : 'h-64',
        className
      )}
    >
      <Spinner />
      {label && <span>{label}</span>}
    </div>
  )
}
