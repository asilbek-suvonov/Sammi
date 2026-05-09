import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, GraduationCap } from 'lucide-react'
import { useCourse } from '@/api-hooks/course/use-courses'
import { Button } from '@/components/ui/button'
import { CurriculumSheet } from '@/components/preview/curriculum-sheet'
import { LessonPlayer } from '@/components/preview/lesson-player'
import { useCourseCurriculum } from '@/hooks/course/use-course-curriculum'
import { useUserActions } from '@/stores/selectors'
import type { Lesson } from '@/service/lessons/lessons.types'

interface Props {
  courseId: string
}

export function CoursePreviewPage({ courseId }: Props) {
  const { data: course, isLoading } = useCourse(courseId)
  const { enrollCourse, isEnrolled } = useUserActions()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set())

  const curriculumEnabled = sheetOpen || hasOpened
  const { modules, flatLessons, isLoading: curriculumLoading } =
    useCourseCurriculum(courseId, curriculumEnabled)

  const currentIdx = currentLesson
    ? flatLessons.findIndex((l) => l.id === currentLesson.id)
    : -1

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

  if (!isEnrolled(String(course.id))) enrollCourse(String(course.id))

  const handleOpenSheet = () => {
    if (!hasOpened) setHasOpened(true)
    setSheetOpen(true)
  }

  const handleMarkDone = () => {
    if (!currentLesson) return
    setCompletedIds((prev) => new Set([...prev, currentLesson.id]))
    const next = flatLessons[currentIdx + 1]
    if (next) setCurrentLesson(next)
  }

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
          <Button
            variant='outline'
            size='sm'
            onClick={handleOpenSheet}
            className='gap-1.5'
          >
            <BookOpen className='size-4' />
            <span className='hidden sm:inline'>Kurs qismlari</span>
          </Button>
        </div>
      </header>

      <main className='flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-4xl px-4 py-6 md:px-6'>
          <LessonPlayer
            lesson={currentLesson}
            previewUrl={course.preview_video_url_full}
            hasPrev={currentIdx > 0}
            hasNext={currentIdx !== -1 && currentIdx < flatLessons.length - 1}
            isCompleted={currentLesson ? completedIds.has(currentLesson.id) : false}
            onPrev={() => {
              if (currentIdx > 0) setCurrentLesson(flatLessons[currentIdx - 1])
            }}
            onNext={() => {
              if (currentIdx < flatLessons.length - 1)
                setCurrentLesson(flatLessons[currentIdx + 1])
            }}
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
