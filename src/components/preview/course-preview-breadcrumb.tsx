import { Link } from '@tanstack/react-router'
import { ChevronRight, Home, LayoutDashboard } from 'lucide-react'

interface Props {
  from: 'dashboard' | 'landing'
  courseId: string
  courseTitle: string
}

const linkCls =
  'truncate rounded-md px-1.5 py-1 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground'
const rootLinkCls =
  'inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:bg-muted hover:text-foreground'

export function CoursePreviewBreadcrumb({ from, courseId, courseTitle }: Props) {
  if (from === 'dashboard') {
    return (
      <nav
        aria-label='Breadcrumb'
        className='flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground'
      >
        <Link to='/dashboard/overview' className={rootLinkCls}>
          <LayoutDashboard className='size-3.5' />
          <span className='hidden sm:inline'>Dashboard</span>
        </Link>
        <ChevronRight className='size-3.5 shrink-0' />
        <Link to='/dashboard/courses' className={linkCls}>
          Courses
        </Link>
        <ChevronRight className='size-3.5 shrink-0' />
        <span className='truncate px-1.5 py-1 text-foreground/80'>
          {courseTitle}
        </span>
      </nav>
    )
  }

  return (
    <nav
      aria-label='Breadcrumb'
      className='flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground'
    >
      <Link to='/' className={rootLinkCls}>
        <Home className='size-3.5' />
        <span className='hidden sm:inline'>Home</span>
      </Link>
      <ChevronRight className='size-3.5 shrink-0' />
      <Link to='/course/$id' params={{ id: courseId }} className={linkCls}>
        {courseTitle}
      </Link>
    </nav>
  )
}
