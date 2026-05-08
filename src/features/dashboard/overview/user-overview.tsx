import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import { useCourses } from '@/api-hooks/course/use-courses'
import { Main } from '@/components/layout/main'
import { Separator } from '@/components/ui/separator'
import {
  useAuthUser,
  useEnrolledCourses,
  useProfile,
} from '@/stores/selectors'

const UserOverview = () => {
  const user = useAuthUser()
  const profile = useProfile()
  const { data: courses = [] } = useCourses()
  const enrolledCourses = useEnrolledCourses()

  const displayName =
    profile.nickname || user?.firstName || user?.email?.split('@')[0] || 'Learner'

  const enrolled = enrolledCourses
    .map((ec) => courses.find((c) => String(c.id) === ec.courseId))
    .filter((c): c is (typeof courses)[number] => Boolean(c))

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

      {enrolled.length === 0 ? (
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
            {enrolled.map((course) => (
              <Link
                key={course.id}
                to='/course/$id'
                params={{ id: String(course.id) }}
                className='group block'
              >
                <div className='overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md p-4'>
                  <div className='relative h-45 overflow-hidden rounded-md'>
                    <img
                      src={course.image_url ?? undefined}
                      alt={course.title}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                  </div>
                  <div className='p-3'>
                    <p className='mb-2 line-clamp-2 text-sm font-medium leading-tight'>
                      {course.title}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {course.is_free ? 'Free' : course.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Main>
  )
}

export default UserOverview
