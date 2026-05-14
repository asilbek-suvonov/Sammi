import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, ChevronRight, Home } from 'lucide-react'
import { useCourse } from '@/api-hooks/course/use-courses'
import { Button } from '@/components/ui/button'
import { CurriculumSheet } from '@/components/preview/curriculum-sheet'
import { LessonPlayer } from '@/components/preview/lesson-player'
import { PageLoader } from '@/components/shared/loader'
import { useCourseCurriculum } from '@/hooks/course/use-course-curriculum'
import { useLessonTracking } from '@/hooks/course/use-lesson-tracking'
import type { Lesson } from '@/service/lessons/lessons.types'

interface Props {
  courseId: string
}

export function CoursePreviewPage({ courseId }: Props) {
  const { data: course, isLoading } = useCourse(courseId)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const firstSet = useRef(false)

  const { modules, flatLessons, isLoading: curriculumLoading } =
    useCourseCurriculum(courseId, !!courseId && courseId !== '0')

  useEffect(() => {
    if (firstSet.current || curriculumLoading || flatLessons.length === 0) return
    firstSet.current = true
    setCurrentLesson(flatLessons[0])
  }, [curriculumLoading, flatLessons])

  const { completedIds, markDone } = useLessonTracking({ flatLessons, courseId })

  const currentIdx = currentLesson
    ? flatLessons.findIndex((l) => l.id === currentLesson.id)
    : -1

  const canNavigate = !curriculumLoading && currentIdx !== -1
  const hasPrev = canNavigate && currentIdx > 0
  const hasNext = canNavigate && currentIdx < flatLessons.length - 1

  if (isLoading) {
    return <PageLoader fullScreen />
  }

  if (!course) {
    return (
      <div className='flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center'>
        <p className='text-muted-foreground'>Kurs topilmadi.</p>
        <Button asChild variant='outline'>
          <Link to='/'>Bosh sahifa</Link>
        </Button>
      </div>
    )
  }

  const handleMarkDone = () => {
    if (!currentLesson) return
    markDone(currentLesson.id)
    if (hasNext) setCurrentLesson(flatLessons[currentIdx + 1])
  }

  return (
    <div className='flex min-h-svh flex-col bg-background text-foreground'>
      <header className='sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='mx-auto flex h-14 max-w-5xl items-center gap-2 px-3 sm:px-5'>
          <nav
            aria-label='Breadcrumb'
            className='flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground'
          >
            <Link
              to='/'
              className='inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:bg-muted hover:text-foreground'
            >
              <Home className='size-3.5' />
              <span className='hidden sm:inline'>Home</span>
            </Link>
            <ChevronRight className='size-3.5 shrink-0' />
            <Link
              to='/course/$id'
              params={{ id: courseId }}
              className='truncate rounded-md px-1.5 py-1 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground'
            >
              {course.title}
            </Link>
          </nav>

          <Button
            variant='default'
            size='sm'
            onClick={() => setSheetOpen(true)}
            className='shrink-0 gap-1.5 shadow-sm'
          >
            <BookOpen className='size-4' />
            <span className='hidden sm:inline'>Course Module</span>
            <span className='sm:hidden'>Module</span>
          </Button>
        </div>
      </header>

      <main className='flex-1'>
        <div className='mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-8'>
          <LessonPlayer
            lesson={currentLesson}
            previewUrl={course.preview_video_url_full}
            hasPrev={hasPrev}
            hasNext={hasNext}
            isCompleted={currentLesson ? completedIds.has(currentLesson.id) : false}
            onPrev={() => setCurrentLesson(flatLessons[currentIdx - 1])}
            onNext={() => setCurrentLesson(flatLessons[currentIdx + 1])}
            onMarkDone={handleMarkDone}
          />
        </div>
      </main>

      <CurriculumSheet
        modules={modules}
        isLoading={curriculumLoading}
        currentLesson={currentLesson}
        completedIds={completedIds}
        totalCount={flatLessons.length}
        onSelectLesson={setCurrentLesson}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
