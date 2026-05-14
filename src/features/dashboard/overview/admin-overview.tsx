import { Link } from '@tanstack/react-router'
import { BookOpen, Briefcase, FolderGit2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useCourses } from '@/api-hooks/course/use-courses'
import { useProjects } from '@/api-hooks/projects/use-projects'
import { useSources } from '@/api-hooks/sources/useSources'

import { SplineAreaChart } from '@/components/charts/spline-area-chart'
import { Main } from '@/components/layout/main'
import { Separator } from '@/components/ui/separator'

import { useAuthUser } from '@/stores/selectors'

// Demo data — replaced with real API once backend exposes time-series counts.
const DEMO_CATEGORIES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const DEMO_SERIES = [
  { name: 'Enrollments', data: [31, 40, 28, 51, 42, 109, 100, 85, 92, 120, 134, 158] },
  { name: 'Completions', data: [11, 32, 45, 32, 34, 52, 41, 60, 72, 84, 92, 110] },
]

const AdminOverview = () => {
  const { t } = useTranslation()

  const user = useAuthUser()

  const { data: courses = [] } = useCourses()
  const { data: projectData } = useProjects()
  const { data: sourceData } = useSources()

  const projects = projectData?.results ?? []
  const sources = sourceData?.results ?? []

  const displayName =
    user?.firstName ||
    user?.email?.split('@')[0] ||
    'Admin'

  const stats = [
    {
      label: t('totalCourses'),
      value: courses.length,
      icon: BookOpen,
      color: 'text-blue-500',
      href: '/dashboard/courses' as const,
    },
    {
      label: t('totalProjects'),
      value: projects.length,
      icon: Briefcase,
      color: 'text-purple-500',
      href: '/dashboard/projects' as const,
    },
    {
      label: t('sources'),
      value: sources.length,
      icon: FolderGit2,
      color: 'text-orange-500',
      href: '/dashboard/sources' as const,
    },
  ]

  return (
    <Main>
      <div className='mb-2'>
        <h1 className='text-2xl font-bold tracking-tight'>
          {t('welcome')}, {displayName} 👋
        </h1>

        <p className='mt-1 text-sm text-muted-foreground'>
          {t('adminPanelDescription')}
        </p>
      </div>

      <Separator className='my-4' />

      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3'>
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            to={href}
            className='flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50'
          >
            <div className={`rounded-lg bg-muted p-2 ${color}`}>
              <Icon className='size-4' />
            </div>

            <div>
              <p className='text-xl font-bold leading-none'>{value}</p>

              <p className='mt-0.5 text-xs text-muted-foreground'>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className='rounded-xl border bg-card p-4 shadow-sm sm:p-6'>
        <div className='mb-4 flex flex-col gap-1'>
          <h2 className='text-base font-semibold'>Platform activity</h2>
          <p className='text-xs text-muted-foreground'>
            Monthly enrollments vs. completions — wiring to real analytics is
            pending backend support.
          </p>
        </div>
        <SplineAreaChart series={DEMO_SERIES} categories={DEMO_CATEGORIES} />
      </div>
    </Main>
  )
}

export default AdminOverview
