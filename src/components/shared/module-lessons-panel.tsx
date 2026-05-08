import { Loader2, Pencil, Plus, Trash2, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useModule } from '@/api-hooks/module'
import { useDeleteLesson } from '@/api-hooks/lessons/use-lessons'
import type { Lesson } from '@/service/lessons/lessons.types'

interface Props {
  moduleId: number
  onAddLesson: () => void
  onEditLesson: (lesson: Lesson) => void
}

export function ModuleLessonsPanel({
  moduleId,
  onAddLesson,
  onEditLesson,
}: Props) {
  const { data: detail, isLoading } = useModule(moduleId)
  const deleteLesson = useDeleteLesson()
  const lessons = detail?.lessons ?? []

  return (
    <div className='space-y-3 p-2'>
      <div className="flex justify-end items-center border-b pb-2">
        <Button
          size='sm'
          variant='outline'
          onClick={onAddLesson}
        >
          <Plus className='mr-2 size-4' />
          Dars qo'shish
        </Button>
      </div>
      {isLoading ? (
        <div className='flex items-center justify-center py-6 text-muted-foreground'>
          <Loader2 className='mr-2 size-4 animate-spin' />
          <span className='text-sm'>Darslar yuklanmoqda...</span>
        </div>
      ) : lessons.length === 0 ? (
        <p className='py-4 text-center text-sm text-muted-foreground'>
          Hali dars qo'shilmagan
        </p>
      ) : (
        <ul className='space-y-2'>
          {lessons.map((lesson, index) => (
            <li
              key={lesson.id}
              className='flex items-center gap-3 rounded-lg border bg-background px-3 py-2'
            >
              <Video className='size-4 shrink-0 text-muted-foreground' />
              <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground'>
                {index + 1}
              </span>
              <span className='flex-1 truncate text-sm font-medium'>
                {lesson.title}
              </span>
              <div className='flex items-center gap-1'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='size-7 text-muted-foreground hover:text-foreground'
                  onClick={() => onEditLesson(lesson)}
                >
                  <Pencil className='size-3.5' />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='size-7 text-muted-foreground hover:text-destructive'
                      disabled={deleteLesson.isPending}
                    >
                      <Trash2 className='size-3.5' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Darsni o'chirish?</AlertDialogTitle>
                      <AlertDialogDescription>
                        "{lesson.title}" darsi butunlay o'chib ketadi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-destructive'
                        onClick={() => deleteLesson.mutate(lesson.id)}
                      >
                        O'chirish
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
