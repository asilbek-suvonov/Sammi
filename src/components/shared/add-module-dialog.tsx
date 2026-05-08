import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, Loader2, Video, Pencil, GripVertical } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useCreateModule, useUpdateModule, useDeleteModule } from '@/api-hooks/module'
import { useDeleteLesson } from '@/api-hooks/lessons/use-lessons'
import { LessonDialog } from './lesson-dialog'
import type { ModuleDetail } from '@/service/module/module.types'
import type { Lesson } from '@/service/lessons/lessons.types'

interface Props {
  courseId: number
  modules: ModuleDetail[]
}

export function AddModuleDialog({ courseId, modules }: Props) {
  const [openModuleId, setOpenModuleId] = useState<number | null>(null)
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null)
  const [lessonDialogModuleId, setLessonDialogModuleId] = useState<number | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>()

  const createModule = useCreateModule()
  const updateModule = useUpdateModule()
  const deleteModule = useDeleteModule()
  const deleteLesson = useDeleteLesson()

  const sortedModules = useMemo(() => [...modules].sort((a, b) => a.order - b.order), [modules])

  const onAddModule = () => {
    const nextOrder = modules.length > 0 ? Math.max(...modules.map(m => m.order)) + 1 : 1
    createModule.mutate(
      { course: courseId, title: `Yangi modul ${modules.length + 1}`, order: nextOrder },
      { onSuccess: (newMod) => setEditingModuleId(newMod.id) }
    )
  }

  const onUpdateModuleTitle = (id: number, newTitle: string) => {
    const current = modules.find(m => m.id === id)
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
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b pb-4'>
        <Button onClick={onAddModule} disabled={createModule.isPending} size='sm' className='shadow-sm'>
          {createModule.isPending
            ? <Loader2 className='mr-2 size-4 animate-spin' />
            : <Plus className='mr-2 size-4' />}
          Modul qo'shish
        </Button>
      </div>

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
                className={cn(
                  'rounded-xl border transition-all duration-200 overflow-hidden',
                  isOpen ? 'border-primary ring-1 ring-primary/10 shadow-md' : 'bg-card'
                )}
              >
                <div className='flex items-center justify-between p-4 bg-muted/5 select-none'>
                  <div
                    className='flex flex-1 items-center gap-3 cursor-pointer'
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
                        />
                      ) : (
                        <h3
                          className='font-semibold text-sm hover:text-primary transition-colors'
                          onDoubleClick={() => setEditingModuleId(mod.id)}
                        >
                          {mod.title}
                        </h3>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size='icon' variant='ghost' className='size-8 text-muted-foreground hover:text-destructive'>
                          <Trash2 className='size-4' />
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
                          <AlertDialogAction className='bg-destructive' onClick={() => deleteModule.mutate(mod.id)}>
                            O'chirish
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button size='icon' variant='ghost' className='size-8' onClick={() => setOpenModuleId(isOpen ? null : mod.id)}>
                      <ChevronDown className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-180')} />
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className='bg-muted/10 border-t overflow-hidden'>
                      <div className='p-4 space-y-2'>
                        {mod.lessons?.map((lesson) => (
                          <div key={lesson.id} className='flex items-center justify-between px-3 py-2 rounded-lg border bg-background group'>
                            <div className='flex items-center gap-2'>
                              <Video className='size-3.5 text-muted-foreground shrink-0' />
                              <p className='text-sm font-medium truncate max-w-[260px]'>{lesson.title}</p>
                            </div>
                            <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                              <Button size='icon' variant='ghost' className='size-7' onClick={() => openEditLesson(lesson)}>
                                <Pencil className='size-3.5' />
                              </Button>
                              <Button size='icon' variant='ghost' className='size-7 text-destructive' onClick={() => deleteLesson.mutate(lesson.id)}>
                                <Trash2 className='size-3.5' />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-full border-dashed text-muted-foreground hover:text-primary mt-1'
                          onClick={() => openAddLesson(mod.id)}
                        >
                          <Plus className='mr-2 size-3.5' /> Dars qo'shish
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <LessonDialog
        open={lessonDialogModuleId !== null}
        onOpenChange={(isOpen) => { if (!isOpen) { setLessonDialogModuleId(null); setEditingLesson(undefined) } }}
        moduleId={lessonDialogModuleId ?? 0}
        lesson={editingLesson}
      />
    </div>
  )
}
