import { cn } from '@/lib/utils'
import eduLogo from '@/assets/EduLogo.png'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      src={eduLogo}
      alt='Edu Center'
      className={cn('size-6 object-contain', className)}
    />
  )
}
