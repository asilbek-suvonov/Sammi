import { Link } from '@tanstack/react-router'

interface PageBreadcrumbProps {
  label: string
}

export function PageBreadcrumb({ label }: PageBreadcrumbProps) {
  return (
    <nav className='mb-8 flex items-center gap-1.5 text-sm text-muted-foreground'>
      <Link to='/' className='transition-colors hover:text-foreground'>
        Home
      </Link>
      <span>/</span>
      <span className='text-foreground'>{label}</span>
    </nav>
  )
}
