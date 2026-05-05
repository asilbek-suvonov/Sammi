import { CourseCurriculum } from '@/components/course/course-curriculum'
import { CourseSideCard } from '@/components/course/course-side-card'
import { PageBreadcrumb } from '@/components/public/page-breadcrumb'
import { PublicHeader } from '@/components/public/public-header'
import { PublicNavRight } from '@/components/public/public-nav-right'
import { Badge } from '@/components/ui/badge'
import {
  useAuthUser,
  useCourses,
  useUserActions,
} from '@/stores/selectors'
import { getCourseStats } from '@/lib/course-stats'
import { levelVariant } from '@/lib/variants'
import { useNavigate } from '@tanstack/react-router'
import { Clock3, Layers3, Star, Users } from 'lucide-react'
import { useState } from 'react'
import { SignInDialog } from '@/components/public/sign-in-dialog'

interface Props { id: string }

export function CourseDetailPage({ id }: Props) {
  const navigate = useNavigate()
  const user = useAuthUser()
  const { enrollCourse, isEnrolled } = useUserActions()
  const courses = useCourses()
  const [openModules, setOpenModules] = useState<string[]>([])

  const [loginOpen, setLoginOpen] = useState(false)

  const course = courses.find((c) => c.id === id)
  const enrolled = course ? isEnrolled(course.id) : false

  if (!course) return (
    <div className='flex min-h-screen items-center justify-center'>
      <p className='text-muted-foreground'>Course not found.</p>
    </div>
  )

  const stats = getCourseStats(course)
  const totalLessons = stats.lessonCount
  const toggleModule = (moduleId: string) =>
    setOpenModules((prev) => prev.includes(moduleId) ? prev.filter((x) => x !== moduleId) : [...prev, moduleId])

  const goToPreview = () => {
    if (!enrolled) enrollCourse(course.id)
    navigate({ to: '/course/preview', search: { courseId: course.id } })
  }

  const handleWatch = () => {
    if (!user) {
      setLoginOpen(true)
      return
    }
    goToPreview()
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <PublicHeader
        logoAsLink
        right={<PublicNavRight />}
      />

      <main className='mx-auto max-w-6xl px-4 py-10 md:px-6'>
        <PageBreadcrumb label={course.title} />
        <div className='grid gap-10 lg:grid-cols-[1fr_340px]'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                <Badge variant={levelVariant(course.level)}>{course.level}</Badge>
                <Badge variant='outline'>{course.instructor}</Badge>
              </div>
              <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>{course.title}</h1>
              <p className='text-base leading-relaxed text-muted-foreground'>{course.description}</p>
              <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1.5'><Star className='size-4 fill-amber-400 text-amber-400' /> {course.rating} rating</span>
                <span className='flex items-center gap-1.5'><Users className='size-4' /> {course.students.toLocaleString()} students</span>
                <span className='flex items-center gap-1.5'><Layers3 className='size-4' /> {stats.moduleCount} modules</span>
                <span className='flex items-center gap-1.5'><Clock3 className='size-4' /> {stats.hoursLabel} total</span>
              </div>
            </div>
            <div className='overflow-hidden rounded-xl border'>
              <img src={course.image} alt={course.title} className='h-64 w-full object-cover md:h-80' />
            </div>
            <CourseCurriculum modules={course.modules} openModules={openModules} onToggle={toggleModule} />
          </div>
          <CourseSideCard course={course} totalLessons={totalLessons} enrolled={enrolled} onWatch={handleWatch} />
        </div>
      </main>
      <SignInDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSuccess={goToPreview}
        title='Sign in to watch'
        description={`Sign in to start "${course.title}".`}
      />
    </div>
  )
}
