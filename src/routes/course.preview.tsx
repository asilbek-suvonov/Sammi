import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useUserStore } from '@/stores/user-store'
import { COURSES, type Lesson, type Module } from '@/data/mock-data'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutList,
  Zap,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const searchSchema = z.object({
  courseId: z.string().default('0'),
})

export const Route = createFileRoute('/course/preview')({
  validateSearch: searchSchema,
  component: CoursePreviewPage,
})

// Public sample video for demo
const SAMPLE_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

function CoursePreviewPage() {
  const { courseId } = Route.useSearch()
  const navigate = useNavigate()
  const { markLessonWatched, getWatchedLessons, enrollCourse, isEnrolled } =
    useUserStore()

  const course = COURSES.find((c) => c.id === courseId)

  const allLessons = useMemo(
    () => course?.modules.flatMap((m) => m.lessons) ?? [],
    [course],
  )

  const [currentLessonId, setCurrentLessonId] = useState(allLessons[0]?.id ?? '')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [justWatched, setJustWatched] = useState(false)
  const [openModules, setOpenModules] = useState<string[]>(
    course?.modules.map((m) => m.id) ?? [],
  )
  const playerRef = useRef<ReactPlayer>(null)

  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  const currentLesson = allLessons[currentIndex]
  const prevLesson = allLessons[currentIndex - 1]
  const nextLesson = allLessons[currentIndex + 1]

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

  if (!isEnrolled(course.id)) enrollCourse(course.id)

  const watchedLessons = getWatchedLessons(course.id)
  const totalLessons = allLessons.length
  const watchedCount = watchedLessons.length
  const courseProgress =
    totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0

  const isWatched = (lessonId: string) => watchedLessons.includes(lessonId)

  const handleMarkWatched = () => {
    if (!isWatched(currentLessonId)) {
      markLessonWatched(course.id, currentLessonId)
      setJustWatched(true)
      setTimeout(() => setJustWatched(false), 2500)
      toast.success("Dars ko'rilgan deb belgilandi!")
    }
  }

  const handleNext = () => {
    if (nextLesson) {
      if (!isWatched(currentLessonId)) markLessonWatched(course.id, currentLessonId)
      setCurrentLessonId(nextLesson.id)
      setJustWatched(false)
    } else {
      toast.success('🎉 Kurs tugatildi!')
      navigate({ to: '/' })
    }
  }

  const handlePrev = () => {
    if (prevLesson) {
      setCurrentLessonId(prevLesson.id)
      setJustWatched(false)
    }
  }

  const handleVideoEnded = () => {
    if (!isWatched(currentLessonId)) {
      markLessonWatched(course.id, currentLessonId)
      setJustWatched(true)
      setTimeout(() => setJustWatched(false), 2500)
      toast.success("Video tugadi — dars ko'rilgan deb belgilandi!")
    }
  }

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    )
  }

  const selectLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId)
    setJustWatched(false)
    setSheetOpen(false)
  }

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-background text-foreground'>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className='shrink-0 border-b bg-background/95 backdrop-blur'>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2'>
            <div className='flex size-7 items-center justify-center rounded-md bg-foreground'>
              <Zap className='size-3.5 text-background' />
            </div>
            <span className='hidden text-sm font-semibold tracking-tight sm:block'>
              Sammi
            </span>
          </Link>

          {/* Course title center */}
          <div className='flex flex-1 items-center justify-center px-4'>
            <div className='flex items-center gap-2 text-sm'>
              <GraduationCap className='size-4 shrink-0 text-muted-foreground' />
              <span className='line-clamp-1 font-medium'>{course.title}</span>
            </div>
          </div>

          {/* Contents sheet button */}
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() => setSheetOpen(true)}
          >
            <LayoutList className='size-4' />
            <span className='hidden sm:inline'>Darslar</span>
          </Button>
        </div>
      </header>

      {/* ── Course contents Sheet ───────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side='right' className='flex w-80 flex-col p-0 xl:w-96'>
          <SheetHeader className='shrink-0 border-b px-4 py-3'>
            <SheetTitle className='text-left text-sm'>{course.title}</SheetTitle>
            <p className='text-left text-xs text-muted-foreground'>
              {watchedCount}/{totalLessons} ta dars ko'rilgan
            </p>
            <div className='mt-1 flex items-center gap-2'>
              <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-primary transition-all duration-500'
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
              <span className='shrink-0 text-xs font-semibold text-primary'>
                {courseProgress}%
              </span>
            </div>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto p-3'>
            {course.modules.map((module: Module, i: number) => {
              const isOpen = openModules.includes(module.id)
              const moduleWatched = module.lessons.filter((l) => isWatched(l.id)).length
              const allDone = moduleWatched === module.lessons.length
              return (
                <Collapsible
                  key={module.id}
                  open={isOpen}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted'>
                    <span className='flex items-center gap-2.5 text-left'>
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                          allDone
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-foreground',
                        )}
                      >
                        {allDone ? <Check className='size-3' /> : i + 1}
                      </span>
                      <span className='line-clamp-1 leading-tight'>{module.title}</span>
                    </span>
                    <span className='ms-2 flex shrink-0 items-center gap-1.5'>
                      <span className='text-[11px] text-muted-foreground'>
                        {moduleWatched}/{module.lessons.length}
                      </span>
                      <ChevronDown
                        className={cn(
                          'size-3.5 text-muted-foreground transition-transform duration-200',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className='mt-0.5 space-y-0.5 pl-2'>
                      {module.lessons.map((lesson: Lesson) => {
                        const active = lesson.id === currentLessonId
                        const watched = isWatched(lesson.id)
                        return (
                          <li key={lesson.id}>
                            <button
                              type='button'
                              onClick={() => selectLesson(lesson.id)}
                              className={cn(
                                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors',
                                active
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                              )}
                            >
                              <span className='flex size-4 shrink-0 items-center justify-center'>
                                {watched ? (
                                  <CheckCircle2
                                    className={cn(
                                      'size-3.5',
                                      active ? 'text-primary-foreground' : 'text-green-500',
                                    )}
                                  />
                                ) : (
                                  <span className='size-1.5 rounded-full bg-current opacity-40' />
                                )}
                              </span>
                              <span className='line-clamp-1 flex-1 leading-tight'>
                                {lesson.title}
                              </span>
                              <span className='shrink-0 font-mono text-[10px] opacity-50'>
                                {lesson.duration}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className='flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-6xl px-4 py-6 md:px-6'>

          {/* React Player */}
          <div className='overflow-hidden rounded-xl border bg-black shadow-sm'>
            <div className='aspect-video w-full'>
              <ReactPlayer
                ref={playerRef}
                url={SAMPLE_VIDEO}
                width='100%'
                height='100%'
                controls
                onEnded={handleVideoEnded}
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                      disablePictureInPicture: false,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* ── Below player: title + buttons ─────────────────── */}
          <div className='mt-4 space-y-3'>
            {/* Title row */}
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <p className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
                  {currentIndex + 1}-dars / {totalLessons} ta
                </p>
                <h2 className='mt-1 text-xl font-semibold leading-snug'>
                  {currentLesson?.title}
                </h2>
              </div>

              {/* Watched success badge */}
              {(justWatched || isWatched(currentLessonId)) && (
                <div
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-full border border-green-500/30 bg-green-50 px-3 py-1.5 text-green-700 dark:bg-green-500/10 dark:text-green-400',
                    justWatched && 'animate-in fade-in zoom-in-95 duration-300',
                  )}
                >
                  <CheckCircle2 className='size-4' />
                  <span className='text-xs font-medium'>Ko'rilgan</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className='flex flex-wrap items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handlePrev}
                disabled={!prevLesson}
                className='gap-1.5'
              >
                <ChevronLeft className='size-4' />
                Oldingi
              </Button>

              {!isWatched(currentLessonId) ? (
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={handleMarkWatched}
                  className='gap-1.5'
                >
                  <CheckCircle2 className='size-4' />
                  Ko'rilgan
                </Button>
              ) : (
                <div className='flex h-8 items-center gap-1.5 rounded-md bg-muted px-3 text-xs text-muted-foreground'>
                  <Check className='size-3.5 text-green-500' />
                  Ko'rilgan
                </div>
              )}

              <Button size='sm' onClick={handleNext} className='gap-1.5'>
                Keyingi
                <ChevronRight className='size-4' />
              </Button>
            </div>

            {/* Course progress */}
            <div className='rounded-lg border bg-muted/30 px-4 py-3'>
              <div className='mb-2 flex items-center justify-between text-xs'>
                <span className='font-medium text-foreground'>Kurs jarayoni</span>
                <span className='text-muted-foreground'>
                  {watchedCount} / {totalLessons} dars
                </span>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-primary transition-all duration-500'
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
              <p className='mt-1.5 text-right text-xs font-semibold text-primary'>
                {courseProgress}%
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
