import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import { useQueries } from '@tanstack/react-query'
import { courseKeys, useCourses } from '@/api-hooks/course/use-courses'
import { useLessonProgressList } from '@/api-hooks/lesson-progress/use-progress'
import { getCourseDetail } from '@/service/course/course.service'
import type { Course, CourseDetail } from '@/service/course/course.types'
import { Main } from '@/components/layout/main'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthUser, useIsAuthed } from '@/stores/selectors'

interface CourseProgress {
  course: Course
  completed: number
  started: number
  totalLessons: number
}

function ProgressCard({ course, completed, started, totalLessons }: CourseProgress) {
  const total = Math.max(totalLessons, started, completed, 1)
  const percent = Math.min(100, Math.round((completed / total) * 100))

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
            <span>{completed} / {total} darslar</span>
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
  const localCourseProgress = useMemo(() => {
    try {
      const prefix = 'sammi_course_preview_completed:'
      const items: { courseId: number; completed: number }[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key || !key.startsWith(prefix)) continue
        const courseId = Number(key.slice(prefix.length))
        if (!Number.isFinite(courseId) || courseId <= 0) continue
        const raw = localStorage.getItem(key)
        if (!raw) continue
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) continue
        const completed = parsed.filter((x) => Number.isFinite(Number(x))).length
        if (completed > 0) items.push({ courseId, completed })
      }
      return items
    } catch {
      return []
    }
  }, [])

  const { data: progressData, isLoading: progressLoading } =
    useLessonProgressList(undefined, { enabled: isAuthed })
  const { data: courses = [], isLoading: coursesLoading } = useCourses()

  const isLoading = progressLoading || coursesLoading

  const courseProgress = useMemo<CourseProgress[]>(() => {
    const records = progressData?.results ?? []
    const stats = new Map<string, { started: number; completed: number }>()

    for (const p of records) {
      const title =
        p.course_title ||
        (typeof p.lesson === 'number' ? undefined : p.lesson.course_title) ||
        ''
      if (!title) continue

      const cur = stats.get(title) ?? { started: 0, completed: 0 }
      cur.started += 1
      if (p.is_completed) cur.completed += 1
      stats.set(title, cur)
    }

    return Array.from(stats.entries())
      .map(([title, counts]) => {
        const course = courses.find((c) => c.title === title)
        return course ? { course, ...counts, totalLessons: 0 } : null
      })
      .filter((x): x is CourseProgress => !!x)
  }, [progressData, courses])

  const courseProgressMerged = useMemo<CourseProgress[]>(() => {
    if (courseProgress.length > 0) return courseProgress
    if (localCourseProgress.length === 0) return []

    return localCourseProgress
      .map((p) => {
        const course = courses.find((c) => c.id === p.courseId)
        if (!course) return null
        return {
          course,
          completed: p.completed,
          started: p.completed,
          totalLessons: 0,
        } satisfies CourseProgress
      })
      .filter((x): x is CourseProgress => !!x)
  }, [courseProgress, localCourseProgress, courses])

  const detailQueries = useQueries({
    queries: courseProgressMerged.map((cp) => ({
      queryKey: courseKeys.detail(cp.course.id),
      queryFn: () => getCourseDetail(cp.course.id),
      staleTime: 5 * 60 * 1000,
      enabled: courseProgressMerged.length > 0,
    })),
  })
  const courseProgressWithTotals = courseProgressMerged.map((cp, i) => {
    const detail = detailQueries[i]?.data as CourseDetail | undefined
    const totalLessons = detail?.lessons_count ?? cp.started
    return { ...cp, totalLessons }
  })

  const displayName =
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
          {courseProgressWithTotals.map((cp) => (
            <ProgressCard key={cp.course.id} {...cp} />
          ))}
        </div>
      )}
    </Main>
  )
}

export default UserOverview
