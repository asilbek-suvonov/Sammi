import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle: string
  showAll?: string
  seeAllTo?: string
}

export function SectionHeader({ title, subtitle, showAll, seeAllTo }: SectionHeaderProps) {
  return (
    <div className='flex items-end justify-between'>
      <div className='space-y-0.5'>
        <h2 className='text-xl font-semibold tracking-tight'>{title}</h2>
        <p className='text-sm text-muted-foreground'>{subtitle}</p>
      </div>
      {showAll && seeAllTo && (
        <Button variant='ghost' size='sm' className='hidden gap-1.5 text-xs text-muted-foreground md:flex' asChild>
          <Link to={seeAllTo as '/'}>
            {showAll} <ExternalLink className='size-3' />
          </Link>
        </Button>
      )}
    </div>
  )
}
