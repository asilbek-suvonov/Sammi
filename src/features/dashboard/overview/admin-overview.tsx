import { Link } from '@tanstack/react-router'
import { BookOpen, Briefcase, FolderGit2, PlusCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useCourses } from '@/api-hooks/course/use-courses'
import { useProjects } from '@/api-hooks/projects/use-projects'
import { useSources } from '@/api-hooks/sources/useSources'

import { Main } from '@/components/layout/main'
import { Separator } from '@/components/ui/separator'

import { useAuthUser, useProfile } from '@/stores/selectors'

const AdminOverview = () => {
  const { t } = useTranslation()

  const user = useAuthUser()
  const profile = useProfile()

  const { data: courses = [] } = useCourses()
  const { data: projectData } = useProjects()
  const { data: sourceData } = useSources()

  const projects = projectData?.results ?? []
  const sources = sourceData?.results ?? []

  const displayName =
    profile.nickname ||
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

              <p className='mt-0.5 text-xs text-muted-foreground'>
                {label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className='mb-6'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-base font-semibold'>
            {t('recentCourses')}
          </h2>

          <Link
            to='/dashboard/courses'
            className='flex items-center gap-1 text-xs text-primary hover:underline'
          >
            <PlusCircle className='size-3.5' />

            {t('addCourse')}
          </Link>
        </div>

        <div className='overflow-hidden rounded-xl border'>
          <table className='w-full text-sm'>
            <thead className='bg-muted/50'>
              <tr>
                <th className='px-4 py-2 text-left font-medium text-muted-foreground'>
                  {t('title')}
                </th>

                <th className='hidden px-4 py-2 text-left font-medium text-muted-foreground sm:table-cell'>
                  {t('level')}
                </th>

                <th className='hidden px-4 py-2 text-left font-medium text-muted-foreground md:table-cell'>
                  {t('category')}
                </th>

                <th className='px-4 py-2 text-right font-medium text-muted-foreground'>
                  {t('price')}
                </th>
              </tr>
            </thead>

            <tbody className='divide-y'>
              {courses.slice(0, 5).map((course) => (
                <tr
                  key={course.id}
                  className='transition-colors hover:bg-muted/30'
                >
                  <td className='px-4 py-3'>
                    <Link
                      to='/course/$id'
                      params={{ id: String(course.id) }}
                      className='font-medium hover:underline'
                    >
                      {course.title}
                    </Link>
                  </td>

                  <td className='hidden px-4 py-3 capitalize text-muted-foreground sm:table-cell'>
                    {course.level}
                  </td>

                  <td className='hidden px-4 py-3 text-muted-foreground md:table-cell'>
                    {course.category_name || '—'}
                  </td>

                  <td className='px-4 py-3 text-right font-medium'>
                    {course.is_free ? t('free') : course.price}
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className='px-4 py-6 text-center text-muted-foreground'
                  >
                    {t('noCoursesYet')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Main>
  )
}

export default AdminOverview