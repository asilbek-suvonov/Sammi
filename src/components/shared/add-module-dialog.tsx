import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, Loader2, Video, Pencil, GripVertical } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { useCreateModule, useUpdateModule, useDeleteModule } from '@/api-hooks/module'
import { useDeleteLesson } from '@/api-hooks/lessons/use-lessons'
import { LessonDialog } from './lesson-dialog' // Modal oynasi orqali dars qo'shish
import type { ModuleDetail } from '@/service/lessons/lessons.types'
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

  // Hooks
  const createModule = useCreateModule()
  const updateModule = useUpdateModule()
  const deleteModule = useDeleteModule()
  const deleteLesson = useDeleteLesson()

  // Modullarni tartib bo'yicha saralash
  const sortedModules = useMemo(() => [...modules].sort((a, b) => a.order - b.order), [modules])

  // Modul qo'shish
  const onAddModule = () => {
    const nextOrder = modules.length > 0 ? Math.max(...modules.map(m => m.order)) + 1 : 1
    createModule.mutate(
      { course: courseId, title: `Yangi modul ${modules.length + 1}`, order: nextOrder },
      { 
        onSuccess: (newMod) => {
          setEditingModuleId(newMod.id)
          toast.success('Modul yaratildi')
        } 
      }
    )
  }

  // Modul nomini yangilash
  const onUpdateModuleTitle = (id: number, newTitle: string) => {
    const current = modules.find(m => m.id === id)
    if (!newTitle.trim() || newTitle === current?.title) {
      setEditingModuleId(null)
      return
    }
    updateModule.mutate(
      { id, data: { course: courseId, title: newTitle.trim(), order: current?.order ?? 0 } },
      { onSuccess: () => {
        setEditingModuleId(null)
        toast.success('Modul nomi yangilandi')
      }}
    )
  }

  // Darsni tahrirlash dialogini ochish
  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonDialogModuleId(lesson.module)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b pb-4'>
        <h2 className="text-lg font-semibold text-foreground/80">Kurs tarkibi</h2>
        <Button onClick={onAddModule} disabled={createModule.isPending} size='sm' className='shadow-md'>
          {createModule.isPending ? <Loader2 className='mr-2 size-4 animate-spin' /> : <Plus className='mr-2 size-4' />}
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
                  'rounded-2xl border transition-all duration-300 overflow-hidden',
                  isOpen ? 'border-primary/40 shadow-xl ring-4 ring-primary/5 bg-background' : 'bg-card hover:border-muted-foreground/20'
                )}
              >
                {/* Header qismi */}
                <div className='flex items-center justify-between p-4 sm:p-5 select-none'>
                  <div
                    className='flex flex-1 items-center gap-4 cursor-pointer'
                    onClick={() => !isEditing && setOpenModuleId(isOpen ? null : mod.id)}
                  >
                    <GripVertical className='size-4 text-muted-foreground/20' />
                    <span className='flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[12px] font-bold text-white shadow-md'>
                      {index + 1}
                    </span>
                    <div className='flex-1'>
                      {isEditing ? (
                        <Input
                          defaultValue={mod.title}
                          autoFocus
                          className='h-9 max-w-sm'
                          onClick={(e) => e.stopPropagation()}
                          onBlur={(e) => onUpdateModuleTitle(mod.id, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && onUpdateModuleTitle(mod.id, e.currentTarget.value)}
                        />
                      ) : (
                        <h3
                          className='font-bold text-base transition-colors hover:text-primary'
                          onDoubleClick={(e) => { e.stopPropagation(); setEditingModuleId(mod.id) }}
                        >
                          {mod.title}
                        </h3>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-1'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size='icon' variant='ghost' className='size-9 text-muted-foreground hover:text-destructive'>
                          <Trash2 className='size-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Modulni o'chirmoqchimisiz?</AlertDialogTitle>
                          <AlertDialogDescription>Ushbu modul va undagi barcha darslar o'chib ketadi.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                          <AlertDialogAction className='bg-destructive' onClick={() => deleteModule.mutate(mod.id)}>
                            O'chirish
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button size='icon' variant='ghost' className={cn('size-9 transition-transform duration-300', isOpen && 'rotate-180 text-primary')} onClick={() => setOpenModuleId(isOpen ? null : mod.id)}>
                      <ChevronDown className='size-5' />
                    </Button>
                  </div>
                </div>

                {/* Darslar ro'yxati (Accordion) */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className='border-t border-muted bg-muted/5'
                    >
                      <div className='p-4 space-y-3'>
                        {mod.lessons?.map((lesson) => (
                          <div key={lesson.id} className='group flex items-center justify-between rounded-xl border bg-background p-3 transition-all hover:border-primary/30'>
                            <div className='flex items-center gap-3'>
                              <div className='flex size-9 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10'>
                                <Video className='size-4 text-muted-foreground group-hover:text-primary' />
                              </div>
                              <p className='text-sm font-semibold truncate max-w-[280px]'>{lesson.title}</p>
                            </div>

                            <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                              <Button size='icon' variant='ghost' className='size-8' onClick={() => openEditLesson(lesson)}>
                                <Pencil className='size-3.5' />
                              </Button>
                              <Button size='icon' variant='ghost' className='size-8 text-destructive hover:bg-destructive/10' onClick={() => deleteLesson.mutate(lesson.id)}>
                                <Trash2 className='size-3.5' />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button
                          variant='outline'
                          size='sm'
                          className='w-full border-dashed py-6 hover:bg-primary/5 hover:border-primary transition-all'
                          onClick={() => setLessonDialogModuleId(mod.id)}
                        >
                          <Plus className='mr-2 size-4' /> Dars qo'shish
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

      {/* Dars qo'shish/tahrirlash Modali */}
      <LessonDialog
        open={lessonDialogModuleId !== null}
        onOpenChange={(isOpen) => { 
          if (!isOpen) { 
            setLessonDialogModuleId(null); 
            setEditingLesson(undefined) 
          } 
        }}
        moduleId={lessonDialogModuleId ?? 0}
        lesson={editingLesson}
      />
    </div>
  )
}