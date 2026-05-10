import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import { useEnrollments } from '@/api-hooks/enrollment/use-enrollment'
import { useCourses } from '@/api-hooks/course/use-courses'
import { Main } from '@/components/layout/main'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthUser, useProfile } from '@/stores/selectors'
import type { Enrollment } from '@/service/enrollment/enrollment.type'
import type { Course } from '@/service/course/course.types'

interface EnrolledCardProps {
  enrollment: Enrollment
  course: Course
}

function EnrolledCard({ enrollment, course }: EnrolledCardProps) {
  const courseId =
    typeof enrollment.course === 'object' ? enrollment.course.id : enrollment.course
  const progress = Math.round(enrollment.progress_percentage ?? 0)

  return (
    <Link
      to='/course/preview'
      search={{ courseId: String(courseId) }}
      className='group block overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'
    >
      <div className='relative aspect-video overflow-hidden bg-muted'>
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

      <div className='p-3 space-y-2'>
        <p className='line-clamp-2 text-sm font-medium leading-tight'>{course.title}</p>

        <div className='space-y-1'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>Progress</span>
            <span className='font-medium text-foreground'>{progress}%</span>
          </div>
          <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
            <div
              className='h-full rounded-full bg-primary transition-all duration-500'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

const UserOverview = () => {
  const user = useAuthUser()
  const profile = useProfile()

  const { data: enrollmentData, isLoading: enrollmentsLoading } = useEnrollments()
  const { data: courses = [], isLoading: coursesLoading } = useCourses()

  const isLoading = enrollmentsLoading || coursesLoading
  const enrollments = enrollmentData?.results ?? []

  const enrolled = enrollments
    .map((e) => {
      const courseId = typeof e.course === 'object' ? e.course.id : e.course
      const course = courses.find((c) => c.id === courseId)
      return course ? { enrollment: e, course } : null
    })
    .filter((item): item is { enrollment: Enrollment; course: Course } => item !== null)

  const displayName =
    profile.nickname || user?.firstName || user?.email?.split('@')[0] || 'Learner'

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
            <div key={i} className='overflow-hidden rounded-xl border bg-card'>
              <Skeleton className='aspect-video w-full' />
              <div className='p-3 space-y-2'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-1.5 w-full' />
              </div>
            </div>
          ))}
        </div>
      ) : enrolled.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <BookOpen className='mb-3 size-10 text-muted-foreground/50' />
          <p className='text-sm font-medium'>Hali hech qanday kursga yozilmadingiz</p>
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
          {enrolled.map(({ enrollment, course }) => (
            <EnrolledCard
              key={enrollment.id}
              enrollment={enrollment}
              course={course}
            />
          ))}
        </div>
      )}
    </Main>
  )
}

export default UserOverview
