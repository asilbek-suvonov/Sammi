import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Separator } from '@/components/ui/separator'
import { useAdminStore } from '@/stores/admin-store'
import { useAuthStore } from '@/stores/auth-store'
import { useProfileStore } from '@/stores/profile-store'
import { Link } from '@tanstack/react-router'
import { BookOpen, Briefcase, DollarSign, FolderGit2, PlusCircle, Users } from 'lucide-react'

const AdminOverview = () => {
  const { auth } = useAuthStore()
  const { profile } = useProfileStore()
  const { courses, projects, sources, totalStudents, totalRevenue } = useAdminStore()

  const user = auth.user
  const displayName =
    profile.nickname || user?.firstName || user?.email?.split('@')[0] || 'Admin'

  const stats = [
    {
      label: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'text-blue-500',
      href: '/dashboard/courses',
    },
    {
      label: 'Total Projects',
      value: projects.length,
      icon: Briefcase,
      color: 'text-purple-500',
      href: '/dashboard/projects',
    },
    {
      label: 'Total Students',
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: 'text-green-500',
      href: '/dashboard/courses',
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-500',
      href: '/dashboard/courses',
    },
    {
      label: 'Sources',
      value: sources.length,
      icon: FolderGit2,
      color: 'text-orange-500',
      href: '/dashboard/sources',
    },
  ]

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Welcome, {displayName} 👋
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Admin Panel — manage courses, projects and sources.
          </p>
        </div>

        <Separator className='my-4' />

        {/* Stats */}
        <div className='mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
          {stats.map(({ label, value, icon: Icon, color, href }) => (
            <Link
              key={label}
              to={href as '/dashboard/courses'}
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

        {/* Recent Courses */}
        <div className='mb-6'>
          <div className='mb-3 flex items-center justify-between'>
            <h2 className='text-base font-semibold'>Recent Courses</h2>
            <Link
              to='/dashboard/courses'
              className='flex items-center gap-1 text-xs text-primary hover:underline'
            >
              <PlusCircle className='size-3.5' /> Add course
            </Link>
          </div>
          <div className='overflow-hidden rounded-xl border'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/50'>
                <tr>
                  <th className='px-4 py-2 text-left font-medium text-muted-foreground'>Title</th>
                  <th className='hidden px-4 py-2 text-left font-medium text-muted-foreground sm:table-cell'>Level</th>
                  <th className='hidden px-4 py-2 text-right font-medium text-muted-foreground md:table-cell'>Students</th>
                  <th className='px-4 py-2 text-right font-medium text-muted-foreground'>Price</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {courses.slice(0, 5).map((course) => (
                  <tr key={course.id} className='hover:bg-muted/30 transition-colors'>
                    <td className='px-4 py-3'>
                      <Link
                        to='/course/$id'
                        params={{ id: course.id }}
                        className='font-medium hover:underline'
                      >
                        {course.title}
                      </Link>
                    </td>
                    <td className='hidden px-4 py-3 text-muted-foreground sm:table-cell'>
                      {course.level}
                    </td>
                    <td className='hidden px-4 py-3 text-right text-muted-foreground md:table-cell'>
                      {course.students.toLocaleString()}
                    </td>
                    <td className='px-4 py-3 text-right font-medium'>{course.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Main>
    </>
  )
}

export default AdminOverview
