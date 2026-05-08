import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, Loader2, Video, Pencil, GripVertical } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

import { useUpdateModule, useDeleteModule } from '@/api-hooks/module'
import {
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useGetModuleDetails,
} from '../../api-hooks/lessons/use-lessons'
import { LessonForm } from '../LessonForm'
import { Module } from '../../service/lessons/lessons.types'

// Konstanta va Utils
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/

interface Props {
  courseId: number
  modules: Module[]
}

/**
 * Har bir modul uchun darslar ro'yxatini render qiluvchi komponent
 */
const ModuleLessonsList = ({
  moduleId,
  editingLessonId,
  addingLessonTo,
  setEditingLessonId,
  setAddingLessonTo,
  onLessonSubmit,
  isActionPending,
}: any) => {
  const { data: moduleData, isLoading } = useGetModuleDetails(moduleId)
  const deleteLesson = useDeleteLesson()

  if (isLoading) {
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='size-6 animate-spin text-primary/60' />
      </div>
    )
  }

  const lessons = moduleData?.lessons || []

  return (
    <div className='space-y-3 bg-muted/5 p-4'>
      {lessons.map((lesson: any) => (
        <div
          key={lesson.id}
          className='group flex items-center justify-between rounded-xl border bg-background p-3 transition-all hover:border-primary/30'
        >
          <div className='flex items-center gap-3'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10'>
              <Video className='size-4 text-muted-foreground group-hover:text-primary' />
            </div>
            <div>
              <p className='mb-1 text-sm font-semibold leading-none'>{lesson.title}</p>
              <div className='flex items-center gap-2 text-[11px] text-muted-foreground'>
                <span>{lesson.duration_formatted || `${lesson.duration} min`}</span>
                {lesson.is_preview && (
                  <Badge variant='secondary' className='h-4 bg-emerald-50 text-[9px] text-emerald-600 border-none'>
                    Preview
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
            <Button size='icon' variant='ghost' className='size-8' onClick={() => setEditingLessonId(lesson.id)}>
              <Pencil className='size-3.5' />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size='icon' variant='ghost' className='size-8 text-destructive hover:bg-destructive/10'>
                  <Trash2 className='size-3.5' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Darsni o'chirmoqchimisiz?</AlertDialogTitle>
                  <AlertDialogDescription>Bu amalni ortga qaytarib bo'lmaydi.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                  <AlertDialogAction className='bg-destructive' onClick={() => deleteLesson.mutate(lesson.id)}>
                    O'chirish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}

      {/* Lesson Form (Add/Edit) */}
      {(addingLessonTo === moduleId || (editingLessonId && lessons.some((l: any) => l.id === editingLessonId))) && (
        <LessonForm
          isPending={isActionPending}
          initialData={lessons.find((l: any) => l.id === editingLessonId)}
          onSubmit={onLessonSubmit(moduleId, editingLessonId || undefined)}
          onCancel={() => { setAddingLessonTo(null); setEditingLessonId(null); }}
        />
      )}

      {!addingLessonTo && !editingLessonId && (
        <Button
          variant='outline'
          size='sm'
          className='w-full border-dashed py-6 hover:bg-primary/5 hover:border-primary transition-all'
          onClick={() => setAddingLessonTo(moduleId)}
        >
          <Plus className='mr-2 size-4' /> Dars qo'shish
        </Button>
      )}
    </div>
  )
}

export function AddModuleDialog({ courseId, modules }: Props) {
  const [openModuleId, setOpenModuleId] = useState<number | null>(null)
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null)
  const [addingLessonTo, setAddingLessonTo] = useState<number | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null)

  const updateModule = useUpdateModule()
  const deleteModule = useDeleteModule()
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()

  const sortedModules = useMemo(() => [...modules].sort((a, b) => a.order - b.order), [modules])

  const handleUpdateModuleTitle = (id: number, newTitle: string) => {
    const currentMod = modules.find((m) => m.id === id)
    if (!newTitle.trim() || newTitle === currentMod?.title) {
      setEditingModuleId(null)
      return
    }
    updateModule.mutate({
      id,
      data: { course: courseId, title: newTitle.trim(), order: currentMod?.order || 0 },
    }, {
      onSuccess: () => { setEditingModuleId(null); toast.success('Modul yangilandi'); }
    })
  }

  const handleLessonSubmit = (moduleId: number, lessonId?: number) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const videoUrl = formData.get('video_url') as string

    if (!YOUTUBE_REGEX.test(videoUrl)) {
      toast.error('Faqat YouTube havolasi qabul qilinadi')
      return
    }

    const payload = {
      module: moduleId,
      title: formData.get('title') as string,
      video_url: videoUrl,
      duration: Number(formData.get('duration')) || 0,
      order: Number(formData.get('order')) || 1,
      is_preview: formData.get('is_preview') === 'on',
    }

    const mutation = lessonId ? updateLesson : createLesson
    const mutationData = lessonId ? { id: lessonId, data: payload } : payload

    mutation.mutate(mutationData as any, {
      onSuccess: () => {
        setEditingLessonId(null)
        setAddingLessonTo(null)
        toast.success(lessonId ? "Dars yangilandi" : "Dars qo'shildi")
      },
    })
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
              className={cn(
                'overflow-hidden rounded-2xl border transition-all duration-300',
                isOpen ? 'border-primary/40 shadow-xl ring-4 ring-primary/5' : 'bg-card hover:border-muted-foreground/20'
              )}
            >
              {/* Module Header */}
              <div className='flex items-center justify-between p-4 sm:p-5'>
                <div 
                  className='flex flex-1 cursor-pointer items-center gap-4' 
                  onClick={() => !isEditing && setOpenModuleId(isOpen ? null : mod.id)}
                >
                  <GripVertical className='size-4 text-muted-foreground/20' />
                  <span className='flex size-7 items-center justify-center rounded-lg bg-primary text-[12px] font-bold text-white shadow-md'>
                    {index + 1}
                  </span>
                  <div className='flex-1'>
                    {isEditing ? (
                      <Input
                        defaultValue={mod.title}
                        autoFocus
                        className='h-9 max-w-[300px]'
                        onBlur={(e) => handleUpdateModuleTitle(mod.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateModuleTitle(mod.id, e.currentTarget.value)
                          if (e.key === 'Escape') setEditingModuleId(null)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3
                        className='cursor-text text-base font-bold select-none'
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setEditingModuleId(mod.id)
                        }}
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
                        <AlertDialogTitle>Modulni o'chirish?</AlertDialogTitle>
                        <AlertDialogDescription>Barcha darslar ham o'chib ketadi.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Bekor</AlertDialogCancel>
                        <AlertDialogAction className='bg-destructive' onClick={() => deleteModule.mutate(mod.id)}>
                          O'chirish
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    size='icon'
                    variant='ghost'
                    className={cn('size-9 transition-transform', isOpen && 'rotate-180 text-primary')}
                    onClick={() => setOpenModuleId(isOpen ? null : mod.id)}
                  >
                    <ChevronDown className='size-5' />
                  </Button>
                </div>
              </div>

              {/* Lessons Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className='border-t border-muted'
                  >
                    <ModuleLessonsList
                      moduleId={mod.id}
                      editingLessonId={editingLessonId}
                      addingLessonTo={addingLessonTo}
                      setEditingLessonId={setEditingLessonId}
                      setAddingLessonTo={setAddingLessonTo}
                      onLessonSubmit={handleLessonSubmit}
                      isActionPending={createLesson.isPending || updateLesson.isPending}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}