import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import { useCourses } from '@/api-hooks/course/use-courses'
import { useLessonProgressList } from '@/api-hooks/lesson-progress/use-progress'
import { useProfile } from '@/api-hooks/profile/use-profile'
import type { Course } from '@/service/course/course.types'
import { Main } from '@/components/layout/main'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthUser, useIsAuthed } from '@/stores/selectors'

interface CourseProgress {
  course: Course
  completed: number
  started: number
}

function ProgressCard({ course, completed, started }: CourseProgress) {
  const total = Math.max(started, completed, 1)
  const percent = Math.round((completed / total) * 100)

  return (
    <Link
      to='/course/preview'
      search={{ courseId: String(course.id) }}
      className='group block overflow-hidden rounded-xl border bg-card p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'
    >
      <div className='relative aspect-video overflow-hidden rounded-lg bg-muted'>
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <BookOpen className='size-8 text-muted-foreground/40' />
          </div>
        )}
      </div>

      <div className='space-y-2 pt-3'>
        <p className='line-clamp-2 text-sm font-medium leading-tight'>
          {course.title}
        </p>

        <div className='space-y-1'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>{completed} / {started} darslar</span>
            <span className='font-medium text-foreground'>{percent}%</span>
          </div>
          <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
            <div
              className='h-full rounded-full bg-primary transition-all duration-500'
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

const UserOverview = () => {
  const user = useAuthUser()
  const isAuthed = useIsAuthed()
  const { data: profile } = useProfile()

  const { data: progressData, isLoading: progressLoading } =
    useLessonProgressList(undefined, { enabled: isAuthed })
  const { data: courses = [], isLoading: coursesLoading } = useCourses()

  const isLoading = progressLoading || coursesLoading

  const courseProgress = useMemo<CourseProgress[]>(() => {
    const records = progressData?.results ?? []
    const stats = new Map<string, { started: number; completed: number }>()

    for (const p of records) {
      if (!p.course_title) continue
      const cur = stats.get(p.course_title) ?? { started: 0, completed: 0 }
      cur.started += 1
      if (p.is_completed) cur.completed += 1
      stats.set(p.course_title, cur)
    }

    return Array.from(stats.entries())
      .map(([title, counts]) => {
        const course = courses.find((c) => c.title === title)
        return course ? { course, ...counts } : null
      })
      .filter((x): x is CourseProgress => !!x)
  }, [progressData, courses])

  const displayName =
    profile?.nickname ||
    profile?.first_name ||
    user?.firstName ||
    user?.email?.split('@')[0] ||
    'Learner'

  return (
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

      <h2 className='mb-3 text-base font-semibold'>Mening kurslarim</h2>

      {isLoading ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='overflow-hidden rounded-xl border bg-card p-3'>
              <Skeleton className='aspect-video w-full rounded-lg' />
              <div className='space-y-2 pt-3'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-1.5 w-full' />
              </div>
            </div>
          ))}
        </div>
      ) : courseProgress.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <BookOpen className='mb-3 size-10 text-muted-foreground/50' />
          <p className='text-sm font-medium'>
            Hali hech qanday kursni boshlamadingiz
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>
            <Link
              to='/dashboard/courses'
              className='text-primary underline-offset-2 hover:underline'
            >
              Kurslar
            </Link>{' '}
            sahifasiga o&apos;ting va o&apos;rganishni boshlang.
          </p>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {courseProgress.map((cp) => (
            <ProgressCard key={cp.course.id} {...cp} />
          ))}
        </div>
      )}
    </Main>
  )
}

export default UserOverview
