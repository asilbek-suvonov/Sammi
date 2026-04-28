import type { ReactNode } from 'react'
import { EduLogo } from './sammi-logo'

interface PublicHeaderProps {
  logoAsLink?: boolean
  center?: ReactNode
  right?: ReactNode
}

export function PublicHeader({ logoAsLink = false, center, right }: PublicHeaderProps) {
  return (
    <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>
        <EduLogo asLink={logoAsLink} />
        {center}
        {right && <div className='flex items-center gap-2'>{right}</div>}
      </div>
    </header>
  )
}
