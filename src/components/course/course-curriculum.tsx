import type { Module } from '@/data/mock-data'
import { ChevronDown, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface CourseCurriculumProps {
  modules: Module[]
  openModules: string[]
  onToggle: (moduleId: string) => void
}

export function CourseCurriculum({
  modules,
  openModules,
  onToggle,
}: CourseCurriculumProps) {
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Course Curriculum</h2>

      <p className="text-sm text-muted-foreground">
        {modules.length} modules • {totalLessons} lessons
      </p>

      <div className="space-y-2">
        {modules.map((module, i) => {
          const isOpen = openModules.includes(module.id)

          return (
            <Collapsible
              key={module.id}
              open={isOpen}
              onOpenChange={() => onToggle(module.id)}
            >
              {/* HEADER */}
              <CollapsibleTrigger
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  isOpen
                    ? "bg-muted hover:bg-muted/80"
                    : "bg-background hover:bg-muted/50"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {i + 1}
                  </span>

                  <span className="truncate">{module.title}</span>

                  <span className="text-xs text-muted-foreground">
                    {module.lessons.length} lessons
                  </span>
                </span>

                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>

              {/* CONTENT */}
              <CollapsibleContent>
                <ul className="mt-1 space-y-1 rounded-lg border bg-background px-3 py-2">
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted/50"
                    >
                      <span className="flex items-center gap-2 text-foreground">
                        <PlayCircle className="size-3.5 text-muted-foreground" />
                        <span className="truncate">{lesson.title}</span>
                      </span>

                      <span className="font-mono text-xs text-muted-foreground">
                        {lesson.duration}
                      </span>
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