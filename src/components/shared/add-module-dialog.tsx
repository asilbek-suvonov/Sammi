import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import {
  ChevronDown,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  Video,
} from 'lucide-react'

import {
  useDeleteModule,
  useUpdateModule,
} from '@/api-hooks/module'

import { useDeleteLesson } from '@/api-hooks/lessons/use-lessons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

import { cn } from '@/lib/utils'

import { LessonDialog } from './lesson-dialog'

import type { ModuleDetail } from '@/service/module/module.types'
import type { Lesson } from '@/service/lessons/lessons.types'

interface Props {
  courseId: number
  modules: ModuleDetail[]
}

export function AddModuleDialog({
  courseId,
  modules,
}: Props) {
  const [openModuleId, setOpenModuleId] =
    useState<number | null>(null)

  const [editingModuleId, setEditingModuleId] =
    useState<number | null>(null)

  const [lessonDialogModuleId, setLessonDialogModuleId] =
    useState<number | null>(null)

  const [editingLesson, setEditingLesson] =
    useState<Lesson | undefined>()

  const updateModule = useUpdateModule()

  const deleteModule = useDeleteModule()

  const deleteLesson = useDeleteLesson()

  const sortedModules = useMemo(() => {
    return [...modules].sort(
      (a, b) => a.order - b.order
    )
  }, [modules])

  const onUpdateModuleTitle = (
    id: number,
    title: string
  ) => {
    const currentModule = modules.find(
      (m) => m.id === id
    )

    if (
      !title.trim() ||
      title === currentModule?.title
    ) {
      setEditingModuleId(null)
      return
    }

    updateModule.mutate(
      {
        id,
        data: {
          course: courseId,
          title: title.trim(),
          order: currentModule?.order ?? 1,
        },
      },
      {
        onSuccess: () => {
          setEditingModuleId(null)
        },
      }
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
        {sortedModules.map((module, index) => {
          const isOpen =
            openModuleId === module.id

          const isEditing =
            editingModuleId === module.id

          return (
            <motion.div
              key={module.id}
              layout
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className={cn(
                'overflow-hidden rounded-xl border bg-card transition-all',
                isOpen &&
                  'border-primary shadow-md'
              )}
            >
              <div className='flex items-center justify-between bg-muted/10 p-4'>
                <div
                  className='flex flex-1 cursor-pointer items-center gap-3'
                  onClick={() =>
                    !isEditing &&
                    setOpenModuleId(
                      isOpen
                        ? null
                        : module.id
                    )
                  }
                >
                  <GripVertical className='size-4 text-muted-foreground/40' />

                  <span className='flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary'>
                    {index + 1}
                  </span>

                  <div className='flex-1'>
                    {isEditing ? (
                      <Input
                        autoFocus
                        defaultValue={
                          module.title
                        }
                        className='h-8 max-w-sm'
                        onBlur={(e) =>
                          onUpdateModuleTitle(
                            module.id,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === 'Enter'
                          ) {
                            onUpdateModuleTitle(
                              module.id,
                              e.currentTarget
                                .value
                            )
                          }
                        }}
                      />
                    ) : (
                      <h3
                        className='text-sm font-semibold transition-colors hover:text-primary'
                        onDoubleClick={() =>
                          setEditingModuleId(
                            module.id
                          )
                        }
                      >
                        {module.title}
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
                        className='size-8 hover:text-destructive'
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Modulni o‘chirish?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          Ushbu modul va
                          uning barcha
                          darslari
                          o‘chiriladi.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Bekor qilish
                        </AlertDialogCancel>

                        <AlertDialogAction
                          className='bg-destructive'
                          onClick={() =>
                            deleteModule.mutate(
                              module.id
                            )
                          }
                        >
                          O‘chirish
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    size='icon'
                    variant='ghost'
                    className='size-8'
                    onClick={() =>
                      setOpenModuleId(
                        isOpen
                          ? null
                          : module.id
                      )
                    }
                  >
                    <ChevronDown
                      className={cn(
                        'size-4 transition-transform',
                        isOpen &&
                          'rotate-180'
                      )}
                    />
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                    }}
                    animate={{
                      height: 'auto',
                    }}
                    exit={{
                      height: 0,
                    }}
                    className='overflow-hidden border-t bg-muted/5'
                  >
                    <div className='space-y-2 p-4'>
                      {module.lessons?.map(
                        (lesson) => (
                          <div
                            key={lesson.id}
                            className='group flex items-center justify-between rounded-lg border bg-background px-3 py-2'
                          >
                            <div className='flex items-center gap-2'>
                              <Video className='size-4 text-muted-foreground' />

                              <p className='max-w-[260px] truncate text-sm font-medium'>
                                {
                                  lesson.title
                                }
                              </p>
                            </div>

                            <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='size-7'
                                onClick={() =>
                                  openEditLesson(
                                    lesson
                                  )
                                }
                              >
                                <Pencil className='size-3.5' />
                              </Button>

                              <Button
                                size='icon'
                                variant='ghost'
                                className='size-7 text-destructive'
                                onClick={() =>
                                  deleteLesson.mutate(
                                    lesson.id
                                  )
                                }
                              >
                                <Trash2 className='size-3.5' />
                              </Button>
                            </div>
                          </div>
                        )
                      )}

                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2 w-full border-dashed'
                        onClick={() =>
                          openAddLesson(
                            module.id
                          )
                        }
                      >
                        <Plus className='mr-2 size-4' />
                        Dars qo‘shish
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </AnimatePresence>

      <LessonDialog
        open={
          lessonDialogModuleId !== null
        }
        onOpenChange={(open) => {
          if (!open) {
            setLessonDialogModuleId(
              null
            )

            setEditingLesson(undefined)
          }
        }}
        moduleId={
          lessonDialogModuleId ?? 0
        }
        lesson={editingLesson}
      />
    </div>
  )
}
