import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, GraduationCap } from 'lucide-react'
import { useCourse } from '@/api-hooks/course/use-courses'
import { Button } from '@/components/ui/button'
import { CurriculumSheet } from '@/components/preview/curriculum-sheet'
import { LessonPlayer } from '@/components/preview/lesson-player'
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

  // Always load curriculum — not lazily — so first lesson can auto-play
  const { modules, flatLessons, isLoading: curriculumLoading } =
    useCourseCurriculum(courseId, !!courseId && courseId !== '0')

  // Auto-select the very first lesson once curriculum finishes loading
  useEffect(() => {
    if (firstSet.current || curriculumLoading || flatLessons.length === 0) return
    firstSet.current = true
    setCurrentLesson(flatLessons[0])
  }, [curriculumLoading, flatLessons])

  const { completedIds, markDone } = useLessonTracking({ courseId, flatLessons })

  const currentIdx = currentLesson
    ? flatLessons.findIndex((l) => l.id === currentLesson.id)
    : -1

  const canNavigate = !curriculumLoading && currentIdx !== -1
  const hasPrev = canNavigate && currentIdx > 0
  const hasNext = canNavigate && currentIdx < flatLessons.length - 1

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
    <div className='flex h-screen flex-col overflow-hidden bg-background text-foreground'>
      <header className='shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>
          <Link
            to='/'
            className='text-sm font-bold tracking-tight text-foreground transition-opacity hover:opacity-70'
          >
            Sammi
          </Link>

          <div className='flex min-w-0 flex-1 items-center justify-center px-6'>
            <div className='flex min-w-0 items-center gap-2 text-sm'>
              <GraduationCap className='size-4 shrink-0 text-muted-foreground' />
              <span className='truncate font-medium'>{course.title}</span>
            </div>
          </div>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => setSheetOpen(true)}
            className='shrink-0 gap-1.5'
          >
            <BookOpen className='size-4' />
            <span className='hidden text-xs sm:inline'>Kurs qismlari</span>
          </Button>
        </div>
      </header>

      <main className='flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-4xl px-4 py-6 md:px-6'>
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
