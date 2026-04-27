import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface DashboardBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function DashboardBreadcrumb({ items, className }: DashboardBreadcrumbProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={`${item.label}-${i}`} className='flex items-center gap-1'>
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className='transition-colors hover:text-foreground'
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && 'font-medium text-foreground')}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className='size-4 text-muted-foreground/60' />}
          </span>
        )
      })}
    </nav>
  )
}
