import { useRef, useState } from 'react'
import { Loader2, Upload, Video } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useCreateLesson, useUpdateLesson } from '@/api-hooks/lessons/use-lessons'
import type { Lesson } from '@/service/lessons/lessons.types'

interface LessonFormProps {
  moduleId: number
  lesson?: Lesson
  onClose: () => void
}

function LessonForm({ moduleId, lesson, onClose }: LessonFormProps) {
  const isEdit = !!lesson
  const fileRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState(lesson?.title ?? '')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')

  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()
  const isPending = createLesson.isPending || updateLesson.isPending

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoFile(file)
    setFileName(file.name)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const payload = {
      module: moduleId,
      title: title.trim(),
      video: videoFile ?? undefined,
      video_url: !videoFile ? (lesson?.video_url ?? '') : undefined,
    }
    if (isEdit) {
      updateLesson.mutate({ id: lesson.id, data: payload }, { onSuccess: onClose })
    } else {
      createLesson.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <form id='lesson-form' onSubmit={handleSubmit} className='space-y-4 pt-2'>
      <div className='space-y-2'>
        <Label htmlFor='lesson-title'>Dars nomi</Label>
        <Input
          id='lesson-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Dars nomini kiriting'
          required
          autoFocus
        />
      </div>

      <div className='space-y-2'>
        <Label>
          Video{' '}
          {isEdit && (
            <span className='text-xs font-normal text-muted-foreground'>
              (o'zgartirish uchun yuklang)
            </span>
          )}
        </Label>
        <div
          role='button'
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 transition-colors',
            'border-input hover:border-primary/60 hover:bg-muted/30',
            fileName && 'border-primary/40 bg-muted/20'
          )}
        >
          {fileName ? (
            <Video className='size-5 text-primary' />
          ) : (
            <Upload className='size-5 text-muted-foreground' />
          )}
          <p className='text-center text-sm text-muted-foreground'>
            {fileName || 'Video faylni tanlash uchun bosing'}
          </p>
          <p className='text-xs text-muted-foreground/60'>MP4, MOV, AVI, MKV</p>
        </div>
        <input
          ref={fileRef}
          type='file'
          accept='video/*'
          onChange={handleFileChange}
          className='hidden'
        />
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type='submit' disabled={isPending || !title.trim()}>
          {isPending && <Loader2 className='mr-2 size-4 animate-spin' />}
          Saqlash
        </Button>
      </DialogFooter>
    </form>
  )
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleId: number
  lesson?: Lesson
}

export function LessonDialog({ open, onOpenChange, moduleId, lesson }: Props) {
  const formKey = `${moduleId}-${lesson?.id ?? 'new'}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{lesson ? 'Darsni tahrirlash' : "Dars qo'shish"}</DialogTitle>
        </DialogHeader>
        <LessonForm
          key={formKey}
          moduleId={moduleId}
          lesson={lesson}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
