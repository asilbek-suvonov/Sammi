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
import type { Course, Lesson, Module } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import { Check, CheckCircle2, ChevronDown } from 'lucide-react'

interface CurriculumSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course
  currentLessonId: string
  watchedLessons: string[]
  openModules: string[]
  onToggleModule: (id: string) => void
  onSelectLesson: (id: string) => void
  watchedCount: number
  totalLessons: number
  courseProgress: number
}

export function CurriculumSheet({
  open, onOpenChange, course, currentLessonId,
  watchedLessons, openModules, onToggleModule, onSelectLesson,
  watchedCount, totalLessons, courseProgress,
}: CurriculumSheetProps) {
  const isWatched = (id: string) => watchedLessons.includes(id)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='flex w-80 flex-col p-0 xl:w-86'>
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
            <span className='shrink-0 text-xs font-semibold text-primary'>{courseProgress}%</span>
          </div>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto p-3'>
          {course.modules.map((module: Module, i: number) => {
            const isOpen = openModules.includes(module.id)
            const moduleWatched = module.lessons.filter((l: Lesson) => isWatched(l.id)).length
            const allDone = moduleWatched === module.lessons.length

            return (
              <Collapsible key={module.id} open={isOpen} onOpenChange={() => onToggleModule(module.id)}>
                <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted'>
                  <span className='flex items-center gap-2.5 text-left'>
                    <span className={cn('flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold', allDone ? 'bg-green-500 text-white' : 'bg-muted text-foreground')}>
                      {allDone ? <Check className='size-3' /> : i + 1}
                    </span>
                    <span className='line-clamp-1 leading-tight'>{module.title}</span>
                  </span>
                  <span className='ms-2 flex shrink-0 items-center gap-1.5'>
                    <span className='text-[11px] text-muted-foreground'>{moduleWatched}/{module.lessons.length}</span>
                    <ChevronDown className={cn('size-3.5 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
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
                            onClick={() => onSelectLesson(lesson.id)}
                            className={cn('flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}
                          >
                            <span className='flex size-4 shrink-0 items-center justify-center'>
                              {watched
                                ? <CheckCircle2 className={cn('size-3.5', active ? 'text-primary-foreground' : 'text-green-500')} />
                                : <span className='size-1.5 rounded-full bg-current opacity-40' />}
                            </span>
                            <span className='line-clamp-1 flex-1 leading-tight'>{lesson.title}</span>
                            <span className='shrink-0 font-mono text-[10px] opacity-50'>{lesson.duration}</span>
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
  )
}
