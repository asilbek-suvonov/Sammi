import { CurriculumSheet } from '@/components/preview/curriculum-sheet'
import { LessonPlayer } from '@/components/preview/lesson-player'
import { Button } from '@/components/ui/button'
import { useAdminStore } from '@/stores/admin-store'
import { useUserStore } from '@/stores/user-store'
import { Link, useNavigate } from '@tanstack/react-router'
import { GraduationCap, LayoutList } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

interface Props { courseId: string }

export function CoursePreviewPage({ courseId }: Props) {
  const navigate = useNavigate()
  const { markLessonWatched, getWatchedLessons, enrollCourse, isEnrolled } = useUserStore()
  const { courses } = useAdminStore()

  const course = courses.find((c) => c.id === courseId)
  const allLessons = useMemo(() => course?.modules.flatMap((m) => m.lessons) ?? [], [course])

  const [currentLessonId, setCurrentLessonId] = useState(allLessons[0]?.id ?? '')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [justWatched, setJustWatched] = useState(false)
  const [openModules, setOpenModules] = useState<string[]>(course?.modules.map((m) => m.id) ?? [])

  if (!course) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4'>
        <p className='text-muted-foreground'>Course not found.</p>
        <Button asChild variant='outline'><Link to='/'>Go Home</Link></Button>
      </div>
    )
  }

  if (!isEnrolled(course.id)) enrollCourse(course.id)

  const watchedLessons = getWatchedLessons(course.id)
  const totalLessons = allLessons.length
  const watchedCount = watchedLessons.length
  const courseProgress = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  const currentLesson = allLessons[currentIndex]
  const isCurrentWatched = watchedLessons.includes(currentLessonId)

  const flash = () => { setJustWatched(true); setTimeout(() => setJustWatched(false), 2500) }

  const handleMarkWatched = () => {
    if (!isCurrentWatched) { markLessonWatched(course.id, currentLessonId); flash(); toast.success("Dars ko'rilgan deb belgilandi!") }
  }

  const handleNext = () => {
    const next = allLessons[currentIndex + 1]
    if (next) { if (!isCurrentWatched) markLessonWatched(course.id, currentLessonId); setCurrentLessonId(next.id); setJustWatched(false) }
    else { toast.success('🎉 Kurs tugatildi!'); navigate({ to: '/' }) }
  }

  const handlePrev = () => {
    const prev = allLessons[currentIndex - 1]
    if (prev) { setCurrentLessonId(prev.id); setJustWatched(false) }
  }

  const handleVideoEnded = () => {
    if (!isCurrentWatched) { markLessonWatched(course.id, currentLessonId); flash(); toast.success("Video tugadi — dars ko'rilgan deb belgilandi!") }
  }

  const toggleModule = (id: string) =>
    setOpenModules((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const selectLesson = (id: string) => { setCurrentLessonId(id); setJustWatched(false); setSheetOpen(false) }

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-background text-foreground'>
      <header className='shrink-0 border-b bg-background/95 backdrop-blur'>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>
          <Link to='/' className='flex items-center gap-2'>
            <span className='hidden text-sm font-semibold tracking-tight sm:block'>Edu Center</span>
          </Link>
          <div className='flex flex-1 items-center justify-center px-4'>
            <div className='flex items-center gap-2 text-sm'>
              <GraduationCap className='size-4 shrink-0 text-muted-foreground' />
              <span className='line-clamp-1 font-medium'>{course.title}</span>
            </div>
          </div>
          <Button variant='outline' size='sm' className='gap-1.5' onClick={() => setSheetOpen(true)}>
            <LayoutList className='size-4' />
            <span className='hidden sm:inline'>Darslar</span>
          </Button>
        </div>
      </header>

      <CurriculumSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        course={course}
        currentLessonId={currentLessonId}
        watchedLessons={watchedLessons}
        openModules={openModules}
        onToggleModule={toggleModule}
        onSelectLesson={selectLesson}
        watchedCount={watchedCount}
        totalLessons={totalLessons}
        courseProgress={courseProgress}
      />

      <main className='flex-1 overflow-y-auto'>
        <LessonPlayer
          lesson={currentLesson}
          lessonIndex={currentIndex}
          totalLessons={totalLessons}
          isCurrentWatched={isCurrentWatched}
          justWatched={justWatched}
          hasPrev={currentIndex > 0}
          courseProgress={courseProgress}
          watchedCount={watchedCount}
          onMarkWatched={handleMarkWatched}
          onPrev={handlePrev}
          onNext={handleNext}
          onVideoEnded={handleVideoEnded}
        />
      </main>
    </div>
  )
}
