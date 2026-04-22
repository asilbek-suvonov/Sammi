/* eslint-disable react-refresh/only-export-components */
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminStore } from '@/stores/admin-store'
import { useAuthStore } from '@/stores/auth-store'
import { useUserStore } from '@/stores/user-store'
import { Link, createFileRoute } from '@tanstack/react-router'
import { BookOpen, Clock3, GraduationCap, Layers3, Plus, Star, Users } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard/courses')({
  component: CoursesPage,
})

function levelVariant(level: string): 'secondary' | 'outline' | 'destructive' {
  if (level === 'Beginner') return 'secondary'
  if (level === 'Advanced') return 'destructive'
  return 'outline'
}

function CoursesPage() {
  const { auth } = useAuthStore()
  const isAdmin = auth.user?.role === 'admin'

  return isAdmin ? <AdminCoursesView /> : <UserCoursesView />
}

function AdminCoursesView() {
  const { courses } = useAdminStore()

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Courses</h2>
            <p className='text-muted-foreground'>
              Manage all courses and their content.
            </p>
          </div>
          <Button size='sm' className='gap-2'>
            <Plus className='size-4' /> Add Course
          </Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {courses.map((course) => (
            <Card
              key={course.id}
              className='group overflow-hidden gap-0 p-0 transition-shadow hover:shadow-md'
            >
              <div className='relative overflow-hidden'>
                <img
                  src={course.image}
                  alt={course.title}
                  className='h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                />
                <div className='absolute left-2.5 top-2.5'>
                  <Badge variant={levelVariant(course.level)} className='text-[11px]'>
                    {course.level}
                  </Badge>
                </div>
              </div>

              <CardHeader className='px-4 pt-4 pb-2'>
                <CardTitle className='text-sm font-semibold leading-snug'>
                  {course.title}
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-3 px-4 pb-4'>
                <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <Layers3 className='size-3' /> {course.parts} modules
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock3 className='size-3' /> {course.hours}h
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='size-3' /> {course.students.toLocaleString()}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Star className='size-3 fill-amber-400 text-amber-400' /> {course.rating}
                  </span>
                </div>

                <div className='flex items-center justify-between border-t pt-3'>
                  <span className='text-sm font-bold'>{course.price}</span>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' className='h-7 text-xs' asChild>
                      <Link to='/course/$id' params={{ id: course.id }}>View</Link>
                    </Button>
                    <Button size='sm' className='h-7 text-xs'>Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}

function UserCoursesView() {
  const { enrolledCourses } = useUserStore()
  const { courses } = useAdminStore()

  const myCourses = courses.filter((c) =>
    enrolledCourses.some((e) => e.courseId === c.id)
  )

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>My Courses</h2>
          <p className='text-muted-foreground'>
            Continue learning from where you left off.
          </p>
        </div>

        {myCourses.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center'>
            <GraduationCap className='size-12 text-muted-foreground/50' />
            <div>
              <p className='font-medium'>No courses yet</p>
              <p className='text-sm text-muted-foreground'>
                Enroll in a course from the landing page to get started.
              </p>
            </div>
            <Button asChild variant='outline'>
              <Link to='/'>Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {myCourses.map((course) => {
              const enrolled = enrolledCourses.find((e) => e.courseId === course.id)
              const totalLessons = course.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              )
              const watched = enrolled?.watchedLessons.length ?? 0
              const progress = totalLessons > 0 ? Math.round((watched / totalLessons) * 100) : 0

              return (
                <Card key={course.id} className='group overflow-hidden gap-0 p-0 transition-shadow hover:shadow-md'>
                  <div className='relative overflow-hidden'>
                    <img
                      src={course.image}
                      alt={course.title}
                      className='h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                    />
                  </div>

                  <CardHeader className='px-4 pt-4 pb-2'>
                    <CardTitle className='text-sm font-semibold'>{course.title}</CardTitle>
                  </CardHeader>

                  <CardContent className='space-y-3 px-4 pb-4'>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <BookOpen className='size-3' /> {watched}/{totalLessons} lessons
                    </div>
                    <div className='space-y-1'>
                      <div className='flex justify-between text-xs'>
                        <span className='text-muted-foreground'>Progress</span>
                        <span className='font-medium'>{progress}%</span>
                      </div>
                      <div className='h-1.5 w-full rounded-full bg-muted'>
                        <div
                          className='h-1.5 rounded-full bg-primary transition-all'
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <Button size='sm' className='w-full' asChild>
                      <Link to='/course/preview' search={{ courseId: course.id }}>
                        Continue Learning
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </Main>
    </>
  )
}
