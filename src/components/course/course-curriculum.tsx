import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { Module } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import { ChevronDown, PlayCircle } from 'lucide-react'

interface CourseCurriculumProps {
  modules: Module[]
  openModules: string[]
  onToggle: (moduleId: string) => void
}

export function CourseCurriculum({ modules, openModules, onToggle }: CourseCurriculumProps) {
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)

  return (
    <div className='space-y-3'>
      <h2 className='text-xl font-semibold'>Course Curriculum</h2>
      <p className='text-sm text-muted-foreground'>
        {modules.length} modules • {totalLessons} lessons
      </p>

      <div className='space-y-2'>
        {modules.map((module, i) => {
          const isOpen = openModules.includes(module.id)
          return (
            <Collapsible key={module.id} open={isOpen} onOpenChange={() => onToggle(module.id)}>
              <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50'>
                <span className='flex items-center gap-2.5'>
                  <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold'>
                    {i + 1}
                  </span>
                  {module.title}
                  <span className='text-xs font-normal text-muted-foreground'>
                    {module.lessons.length} lessons
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className='mt-1 space-y-0.5 rounded-lg border bg-card px-3 py-2'>
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className='flex items-center justify-between rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted/50'
                    >
                      <span className='flex items-center gap-2'>
                        <PlayCircle className='size-3.5 shrink-0 ' />
                        {lesson.title}
                      </span>
                      <span className='font-mono text-xs'>{lesson.duration}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}
