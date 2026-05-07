import { Link } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'
import ReactPlayer from 'react-player'
import { useCourse } from '@/api-hooks/course/use-courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUserActions } from '@/stores/selectors'

interface Props { courseId: string }

export function CoursePreviewPage({ courseId }: Props) {
  const { data: course, isLoading } = useCourse(courseId)
  const { enrollCourse, isEnrolled } = useUserActions()

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center text-sm text-muted-foreground'>
        Yuklanmoqda...
      </div>
    )
  }

  if (!course) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4'>
        <p className='text-muted-foreground'>Course not found.</p>
        <Button asChild variant='outline'>
          <Link to='/'>Go Home</Link>
        </Button>
      </div>
    )
  }

  if (!isEnrolled(String(course.id))) enrollCourse(String(course.id))

  const videoSrc = course.preview_video_url

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-background text-foreground'>
      <header className='shrink-0 border-b bg-background/95 backdrop-blur'>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>
          <Link to='/' className='flex items-center gap-2'>
            <span className='hidden text-sm font-semibold tracking-tight sm:block'>
              Sammi
            </span>
          </Link>
          <div className='flex flex-1 items-center justify-center px-4'>
            <div className='flex items-center gap-2 text-sm'>
              <GraduationCap className='size-4 shrink-0 text-muted-foreground' />
              <span className='line-clamp-1 font-medium'>{course.title}</span>
            </div>
          </div>
          <Badge variant='outline' className='capitalize'>{course.level}</Badge>
        </div>
      </header>

      <main className='flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-6'>
          <div className='overflow-hidden rounded-xl border bg-black shadow-sm'>
            <div className='aspect-video w-full'>
              {videoSrc ? (
                <ReactPlayer src={videoSrc} width='100%' height='100%' controls />
              ) : (
                <div className='flex h-full items-center justify-center text-sm text-white/60'>
                  Preview video not available
                </div>
              )}
            </div>
          </div>

          <div className='space-y-3'>
            <h1 className='text-xl font-semibold leading-snug'>{course.title}</h1>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {course.description}
            </p>
            {course.technologies_list?.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {course.technologies_list.map((t) => (
                  <Badge key={t} variant='secondary'>{t}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
