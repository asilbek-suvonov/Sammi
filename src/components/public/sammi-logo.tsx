import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'

interface SammiLogoProps {
  asLink?: boolean
}

const Inner = () => (
  <>
    <div className='flex size-7 items-center justify-center rounded-md bg-foreground'>
      <Zap className='size-3.5 text-background' />
    </div>
    <span className='text-sm font-semibold tracking-tight'>Sammi</span>
  </>
)

export function SammiLogo({ asLink = false }: SammiLogoProps) {
  if (asLink) {
    return (
      <Link to='/' className='flex items-center gap-2'>
        <Inner />
      </Link>
    )
  }
  return (
    <div className='flex items-center gap-2'>
      <Inner />
    </div>
  )
}
