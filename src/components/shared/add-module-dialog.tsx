import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, GripVertical, Loader2, Trash2 } from 'lucide-react'

import { useDeleteModule, useUpdateModule } from '@/api-hooks/module'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/service/lessons/lessons.types'
import type { ModuleListItem } from '@/service/module/module.types'
import { LessonDialog } from './lesson-dialog'
import { ModuleLessonsPanel } from './module-lessons-panel'

interface Props {
  courseId: number
  modules: ModuleListItem[]
  initialEditingId?: number | null
  onResetEditingId?: () => void
}

export function AddModuleDialog({ courseId, modules, initialEditingId, onResetEditingId }: Props) {
  const [openModuleId, setOpenModuleId] = useState<number | null>(null)
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null)
  const [lessonDialogModuleId, setLessonDialogModuleId] = useState<number | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>()

  const updateModule = useUpdateModule()
  const deleteModule = useDeleteModule()

  const sortedModules = useMemo(() => [...modules].sort((a, b) => a.order - b.order), [modules])

  useEffect(() => {
    if (initialEditingId != null) {
      setEditingModuleId(initialEditingId)
      onResetEditingId?.()
    }
  }, [initialEditingId, onResetEditingId])

  const onUpdateModuleTitle = (id: number, newTitle: string) => {
    const current = modules.find((m) => m.id === id)
    if (!newTitle.trim() || newTitle === current?.title) { setEditingModuleId(null); return }
    updateModule.mutate(
      { id, data: { course: courseId, title: newTitle.trim(), order: current?.order ?? 0 } },
      { onSuccess: () => setEditingModuleId(null) }
    )
  }

  const openAddLesson = (moduleId: number) => {
    setEditingLesson(undefined)
    setLessonDialogModuleId(moduleId)
  }

  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonDialogModuleId(lesson.module)
  }

  return (
    <div className='space-y-4'>
      <AnimatePresence mode='popLayout'>
        {sortedModules.map((mod, index) => {
          const isOpen = openModuleId === mod.id
          const isEditing = editingModuleId === mod.id
          return (
            <motion.div
              key={mod.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                'overflow-hidden rounded-xl border transition-all duration-200',
                isOpen ? 'border-primary shadow-md ring-1 ring-primary/10' : 'bg-card'
              )}
            >
              <div className='flex items-center justify-between bg-muted/5 p-4 select-none'>
                <div
                  className='flex flex-1 cursor-pointer items-center gap-3'
                  onClick={() => !isEditing && setOpenModuleId(isOpen ? null : mod.id)}
                >
                  <GripVertical className='size-4 text-muted-foreground/30' />
                  <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary'>
                    {index + 1}
                  </span>
                  <div className='flex-1'>
                    {isEditing ? (
                      <Input
                        defaultValue={mod.title}
                        autoFocus
                        className='h-8 max-w-sm'
                        onBlur={(e) => onUpdateModuleTitle(mod.id, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onUpdateModuleTitle(mod.id, e.currentTarget.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3
                        className='text-sm font-semibold transition-colors hover:text-primary'
                        onDoubleClick={(e) => { e.stopPropagation(); setEditingModuleId(mod.id) }}
                      >
                        {mod.title}
                      </h3>
                    )}
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='size-8 text-muted-foreground hover:text-destructive'
                        disabled={deleteModule.isPending}
                      >
                        {deleteModule.isPending
                          ? <Loader2 className='size-4 animate-spin' />
                          : <Trash2 className='size-4' />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Modulni o'chirish?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ushbu modul va uning ichidagi barcha darslar butunlay o'chib ketadi.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction
                          className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                          onClick={() => deleteModule.mutate(mod.id)}
                        >
                          O'chirish
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='size-8'
                    onClick={() => setOpenModuleId(isOpen ? null : mod.id)}
                  >
                    <ChevronDown className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-180')} />
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='overflow-hidden border-t bg-muted/10'
                  >
                    <ModuleLessonsPanel
                      moduleId={mod.id}
                      onAddLesson={() => openAddLesson(mod.id)}
                      onEditLesson={openEditLesson}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {modules.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center'>
          <p className='text-sm text-muted-foreground'>Hozircha modullar yo'q</p>
        </div>
      )}

      <LessonDialog
        open={lessonDialogModuleId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) { setLessonDialogModuleId(null); setEditingLesson(undefined) }
        }}
        moduleId={lessonDialogModuleId ?? 0}
        lesson={editingLesson}
      />
    </div>
  )
}
