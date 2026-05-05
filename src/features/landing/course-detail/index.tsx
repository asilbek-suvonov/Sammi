import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCourse } from '@/api-hooks/course/use-courses'
import { CourseSideCard } from '@/components/course/course-side-card'
import { PageBreadcrumb } from '@/components/public/page-breadcrumb'
import { PublicHeader } from '@/components/public/public-header'
import { PublicNavRight } from '@/components/public/public-nav-right'
import { SignInDialog } from '@/components/public/sign-in-dialog'
import { Badge } from '@/components/ui/badge'
import { levelVariant } from '@/lib/variants'
import { useAuthUser, useUserActions } from '@/stores/selectors'

interface Props { id: string }

export function CourseDetailPage({ id }: Props) {
  const navigate = useNavigate()
  const user = useAuthUser()
  const { enrollCourse, isEnrolled } = useUserActions()
  const { data: course, isLoading } = useCourse(id)
  const [loginOpen, setLoginOpen] = useState(false)

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center text-sm text-muted-foreground'>
        Yuklanmoqda...
      </div>
    )
  }

  if (!course) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground'>Course not found.</p>
      </div>
    )
  }

  const courseId = String(course.id)
  const enrolled = isEnrolled(courseId)

  const goToPreview = () => {
    if (!enrolled) enrollCourse(courseId)
    navigate({ to: '/course/preview', search: { courseId } })
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
      <PublicHeader logoAsLink right={<PublicNavRight />} />

      <main className='mx-auto max-w-6xl px-4 py-10 md:px-6'>
        <PageBreadcrumb label={course.title} />
        <div className='grid gap-10 lg:grid-cols-[1fr_340px]'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                <Badge variant={levelVariant(course.level)} className='capitalize'>
                  {course.level}
                </Badge>
                {course.category_name && (
                  <Badge variant='outline'>{course.category_name}</Badge>
                )}
                {course.is_free && <Badge>Free</Badge>}
                {course.is_new && <Badge>New</Badge>}
              </div>
              <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>{course.title}</h1>
              <p className='text-base leading-relaxed text-muted-foreground'>{course.description}</p>
              {course.technologies_list?.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {course.technologies_list.map((tech) => (
                    <Badge key={tech} variant='secondary'>{tech}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div className='overflow-hidden rounded-xl border'>
              <img src={course.image_url} alt={course.title} className='h-64 w-full object-cover md:h-80' />
            </div>
            {course.preview_video_url && (
              <div className='space-y-3'>
                <h2 className='text-xl font-semibold'>Preview</h2>
                <div className='overflow-hidden rounded-xl border bg-black'>
                  <video
                    src={course.preview_video_url}
                    controls
                    className='aspect-video w-full'
                  />
                </div>
              </div>
            )}
          </div>
          <CourseSideCard course={course} enrolled={enrolled} onWatch={handleWatch} />
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
