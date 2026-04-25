import { useState, useMemo } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAdminStore } from '@/stores/admin-store'
import { useUserStore } from '@/stores/user-store'
import { Link } from '@tanstack/react-router'
import { levelVariant } from '@/lib/variants'
import {
  BookOpen,
  Clock,
  Layers3,
  PlayCircle,
  SearchIcon,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

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

const UserCoursesView = () => {
  const { courses } = useAdminStore()
  const { enrolledCourses, enrollCourse, isEnrolled, getWatchedLessons } = useUserStore()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'all' | 'enrolled'>('all')

  const enrolledDetails = useMemo(
    () =>
      enrolledCourses
        .map((ec) => {
          const course = courses.find((c) => c.id === ec.courseId)
          if (!course) return null
          const allLessons = course.modules.flatMap((m) => m.lessons)
          const total = allLessons.length
          const watched = getWatchedLessons(ec.courseId).length
          const progress = total > 0 ? Math.round((watched / total) * 100) : 0
          const remaining = total - watched
          const remainingLessons = allLessons.slice(watched)
          return { course, progress, watched, total, remaining, remainingLessons }
        })
        .filter(Boolean) as {
        course: (typeof courses)[number]
        progress: number
        watched: number
        total: number
        remaining: number
        remainingLessons: { id: string; title: string; duration: string }[]
      }[],
    [enrolledCourses, courses, getWatchedLessons]
  )

  const filteredCourses = useMemo(() => {
    const q = query.toLowerCase()
    const base = tab === 'enrolled'
      ? enrolledDetails.map((d) => d.course)
      : courses
    return base.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.category ?? '').toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
    )
  }, [query, tab, courses, enrolledDetails])

  const handleEnroll = (courseId: string, title: string) => {
    enrollCourse(courseId)
    toast.success(`Enrolled in "${title}"`)
  }

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
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Courses</h1>
            <p className='text-sm text-muted-foreground'>
              Browse and manage your courses.
            </p>
          </div>
        </div>

        <Separator className='my-4' />

        {/* Tab + Search Row */}
        <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex gap-1 rounded-lg border bg-muted p-1 w-fit'>
            {(['all', 'enrolled'] as const).map((t) => (
              <button
                key={t}
                type='button'
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === t
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'all' ? 'All Courses' : `My Courses (${enrolledDetails.length})`}
              </button>
            ))}
          </div>
          <div className='relative w-full sm:w-64'>
            <SearchIcon className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search courses...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        {/* Enrolled Courses with Remaining Lessons */}
        {tab === 'enrolled' && enrolledDetails.length > 0 && (
          <div className='mb-6 space-y-4'>
            {enrolledDetails
              .filter((d) =>
                d.course.title.toLowerCase().includes(query.toLowerCase())
              )
              .map(({ course, progress, watched, total, remaining, remainingLessons }) => (
                <div
                  key={course.id}
                  className='overflow-hidden rounded-xl border bg-card'
                >
                  <div className='flex gap-4 p-4'>
                    <div className='relative h-20 w-32 shrink-0 overflow-hidden rounded-lg'>
                      <img
                        src={course.image}
                        alt={course.title}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <Link
                          to='/course/$id'
                          params={{ id: course.id }}
                          className='text-sm font-semibold hover:underline'
                        >
                          {course.title}
                        </Link>
                        {progress === 100 && (
                          <Badge variant='default' className='shrink-0 text-xs bg-green-500'>
                            Completed
                          </Badge>
                        )}
                      </div>
                      <div className='mt-2'>
                        <div className='mb-1 flex items-center justify-between text-xs text-muted-foreground'>
                          <span>{progress}% complete</span>
                          <span>
                            {watched}/{total} lessons
                          </span>
                        </div>
                        <ProgressBar value={progress} />
                      </div>
                      {remaining > 0 && (
                        <p className='mt-1.5 flex items-center gap-1 text-xs text-muted-foreground'>
                          <Clock className='size-3' />
                          {remaining} lesson{remaining !== 1 ? 's' : ''} remaining
                        </p>
                      )}
                    </div>
                  </div>

                  {remaining > 0 && remainingLessons.length > 0 && (
                    <div className='border-t bg-muted/30 px-4 py-2'>
                      <p className='mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground'>
                        Up next
                      </p>
                      <div className='space-y-1'>
                        {remainingLessons.slice(0, 3).map((lesson) => (
                          <Link
                            key={lesson.id}
                            to='/course/$id'
                            params={{ id: course.id }}
                            className='flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted'
                          >
                            <PlayCircle className='size-3.5 shrink-0 text-primary' />
                            <span className='flex-1 truncate'>{lesson.title}</span>
                            <span className='shrink-0 text-muted-foreground'>
                              {lesson.duration}
                            </span>
                          </Link>
                        ))}
                        {remainingLessons.length > 3 && (
                          <p className='px-2 text-[11px] text-muted-foreground'>
                            +{remainingLessons.length - 3} more lessons
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* All Courses Grid */}
        {tab === 'all' && (
          <>
            {filteredCourses.length === 0 ? (
              <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
                <SearchIcon className='mb-3 size-10 text-muted-foreground/50' />
                <p className='text-sm font-medium'>No courses found</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {filteredCourses.map((course) => {
                  const enrolled = isEnrolled(course.id)
                  const allLessons = course.modules.flatMap((m) => m.lessons)
                  const total = allLessons.length
                  const watched = enrolled ? getWatchedLessons(course.id).length : 0
                  const progress = enrolled && total > 0 ? Math.round((watched / total) * 100) : 0

                  return (
                    <div
                      key={course.id}
                      className='group overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md'
                    >
                      <Link to='/course/$id' params={{ id: course.id }}>
                        <div className='relative h-36 overflow-hidden'>
                          <img
                            src={course.image}
                            alt={course.title}
                            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                          />
                          <div className='absolute left-2 top-2'>
                            <Badge
                              variant={levelVariant(course.level)}
                              className='bg-accent text-[10px]'
                            >
                              {course.level}
                            </Badge>
                          </div>
                          {enrolled && (
                            <div className='absolute bottom-0 left-0 right-0'>
                              <ProgressBar value={progress} />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className='p-3'>
                        <Link
                          to='/course/$id'
                          params={{ id: course.id }}
                          className='block text-sm font-medium leading-snug hover:underline'
                        >
                          {course.title}
                        </Link>
                        <div className='mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <Layers3 className='size-3' /> {course.parts} lessons
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock className='size-3' /> {course.hours}h
                          </span>
                          <span className='flex items-center gap-1'>
                            <Users className='size-3' /> {course.students.toLocaleString()}
                          </span>
                        </div>
                        <div className='mt-3'>
                          {enrolled ? (
                            <Link to='/course/$id' params={{ id: course.id }}>
                              <Button size='sm' variant='outline' className='w-full text-xs'>
                                <PlayCircle className='mr-1.5 size-3.5' />
                                Continue — {progress}%
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              size='sm'
                              className='w-full text-xs'
                              onClick={() => handleEnroll(course.id, course.title)}
                            >
                              <BookOpen className='mr-1.5 size-3.5' />
                              Enroll — {course.price}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Enrolled tab empty state */}
        {tab === 'enrolled' && enrolledDetails.length === 0 && (
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
            <BookOpen className='mb-3 size-10 text-muted-foreground/50' />
            <p className='text-sm font-medium'>No enrolled courses yet</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Switch to "All Courses" to browse and enroll.
            </p>
          </div>
        )}
      </Main>
    </>
  )
}

export default UserCoursesView
