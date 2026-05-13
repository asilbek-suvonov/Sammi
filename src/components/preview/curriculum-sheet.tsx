import { useState } from 'react'
import { CheckCircle2, ChevronDown, VideoOff } from 'lucide-react'
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
import { Spinner } from '@/components/shared/loader'
import { cn } from '@/lib/utils'
import type { CurriculumModule } from '@/hooks/course/use-course-curriculum'
import type { Lesson } from '@/service/lessons/lessons.types'

interface ModuleItemProps {
  mod: CurriculumModule
  currentLesson: Lesson | null
  completedIds: Set<number>
  onSelectLesson: (lesson: Lesson) => void
}

function ModuleItem({
  mod,
  currentLesson,
  completedIds,
  onSelectLesson,
}: ModuleItemProps) {
  const [expanded, setExpanded] = useState(false)
  const doneCount = mod.lessons.filter((l) => completedIds.has(l.id)).length

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded} className='border-b'>
      <CollapsibleTrigger className='flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50'>
        <span className='text-start'>
          {mod.order}. {mod.title}
        </span>
        <div className='flex shrink-0 items-center gap-2'>
          {!mod.isLoading && mod.lessons.length > 0 && (
            <span className='text-xs text-muted-foreground'>
              {doneCount}/{mod.lessons.length}
            </span>
          )}
          <ChevronDown
            className={cn(
              'size-4 text-muted-foreground transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {mod.isLoading ? (
          <div className='flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground'>
            <Spinner size='sm' />
          </div>
        ) : mod.lessons.length === 0 ? (
          <div className='flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground'>
            <VideoOff className='size-3' />
            Bu moduleda hali video yo&apos;q
          </div>
        ) : (
          <ul>
            {mod.lessons.map((lesson, idx) => {
              const done = completedIds.has(lesson.id)
              const active = currentLesson?.id === lesson.id
              return (
                <li key={lesson.id}>
                  <button
                    onClick={() => onSelectLesson(lesson)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted',
                      active && 'bg-primary/10 font-medium text-primary',
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className='size-4 shrink-0 text-primary' />
                    ) : (
                      <span className='w-4 shrink-0 text-center text-xs text-muted-foreground'>
                        {idx + 1}
                      </span>
                    )}
                    <span className='flex-1 leading-tight'>{lesson.title}</span>
                    {lesson.duration_formatted && (
                      <span className='shrink-0 text-xs text-muted-foreground'>
                        {lesson.duration_formatted}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

interface Props {
  modules: CurriculumModule[]
  isLoading: boolean
  currentLesson: Lesson | null
  completedIds: Set<number>
  totalCount: number
  onSelectLesson: (lesson: Lesson) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CurriculumSheet({
  modules,
  isLoading,
  currentLesson,
  completedIds,
  totalCount,
  onSelectLesson,
  open,
  onOpenChange,
}: Props) {
  const handleSelect = (lesson: Lesson) => {
    onSelectLesson(lesson)
    onOpenChange(false)
  }

  const percent =
    totalCount > 0 ? Math.round((completedIds.size / totalCount) * 100) : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='flex w-full max-w-full flex-col gap-0 p-0 sm:w-96 sm:max-w-[24rem]'
      >
        <SheetHeader className='border-b px-4 py-3.5'>
          <SheetTitle className='text-sm font-semibold'>
            Kurs qismlari
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Spinner />
          </div>
        ) : modules.length === 0 ? (
          <div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
            Modullar topilmadi
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto'>
            {modules.map((mod) => (
              <ModuleItem
                key={mod.id}
                mod={mod}
                currentLesson={currentLesson}
                completedIds={completedIds}
                onSelectLesson={handleSelect}
              />
            ))}
          </div>
        )}

        {totalCount > 0 && (
          <div className='border-t px-4 py-3'>
            <div className='mb-1.5 flex items-center justify-between text-xs'>
              <span className='text-muted-foreground'>Kurs progressi</span>
              <span className='font-medium'>{percent}%</span>
            </div>
            <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-primary transition-all duration-500'
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className='mt-1.5 text-xs text-muted-foreground'>
              {completedIds.size} / {totalCount} dars ko&apos;rildi
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
