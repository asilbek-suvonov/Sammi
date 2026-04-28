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
import { useUserStore } from '@/stores/user-store'
import { Link } from '@tanstack/react-router'
import { BookOpen, CheckCircle2, Clock } from 'lucide-react'

function ProgressBar({ value }: { value: number }) {
  return (
    <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
      <div
        className='h-full rounded-full bg-primary transition-all duration-500'
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

const UserOverview = () => {
  const { auth } = useAuthStore()
  const { profile } = useProfileStore()
  const { courses } = useAdminStore()
  const { enrolledCourses, getWatchedLessons } = useUserStore()

  const user = auth.user
  const displayName =
    profile.nickname || user?.firstName || user?.email?.split('@')[0] || 'Learner'

  const enrolledDetails = enrolledCourses
    .map((ec) => {
      const course = courses.find((c) => c.id === ec.courseId)
      if (!course) return null
      const allLessons = course.modules.flatMap((m) => m.lessons)
      const totalLessons = allLessons.length
      const watched = getWatchedLessons(ec.courseId).length
      const progress = totalLessons > 0 ? Math.round((watched / totalLessons) * 100) : 0
      const remaining = totalLessons - watched
      return { course, progress, watched, total: totalLessons, remaining }
    })
    .filter(Boolean) as {
    course: (typeof courses)[number]
    progress: number
    watched: number
    total: number
    remaining: number
  }[]

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
            Welcome back, {displayName} 👋
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Track your learning progress below.
          </p>
        </div>

        <Separator className='my-4' />

        {enrolledDetails.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
            <BookOpen className='mb-3 size-10 text-muted-foreground/50' />
            <p className='text-sm font-medium'>No courses enrolled yet</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Go to{' '}
              <Link
                to='/dashboard/courses'
                className='text-primary underline-offset-2 hover:underline'
              >
                Courses
              </Link>{' '}
              to start learning.
            </p>
          </div>
        ) : (
          <>
            <h2 className='mb-3 text-base font-semibold'>My Courses</h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {enrolledDetails.map(({ course, progress, watched, total, remaining }) => (
                <Link
                  key={course.id}
                  to='/course/$id'
                  params={{ id: course.id }}
                  className='group block'
                >
                  <div className='overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
                    <div className='relative h-32 overflow-hidden'>
                      <img
                        src={course.image}
                        alt={course.title}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                      <div className='absolute bottom-2 left-3 right-3 flex items-center justify-between text-white'>
                        <span className='text-xs font-medium'>{progress}% complete</span>
                        {progress === 100 && (
                          <CheckCircle2 className='size-4 text-green-400' />
                        )}
                      </div>
                    </div>
                    <div className='p-3'>
                      <p className='mb-2 line-clamp-2 text-sm font-medium leading-tight'>
                        {course.title}
                      </p>
                      <ProgressBar value={progress} />
                      <div className='mt-2 flex items-center justify-between text-xs text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <CheckCircle2 className='size-3' /> {watched}/{total} lessons
                        </span>
                        {remaining > 0 && (
                          <span className='flex items-center gap-1'>
                            <Clock className='size-3' /> {remaining} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Main>
    </>
  )
}

export default UserOverview
