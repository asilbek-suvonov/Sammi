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

import {
  useCreateLesson,
  useUpdateLesson,
} from '@/api-hooks/lessons/use-lessons'

import type { Lesson } from '@/service/lessons/lessons.types'

interface LessonFormProps {
  moduleId: number
  lesson?: Lesson
  onClose: () => void
}

/**
 * Fayl nomini o'rtasidan qisqartirib ko'rsatish uchun yordamchi funksiya
 */
const formatFileName = (name: string, maxLength = 30) => {
  if (name.length <= maxLength) return name;
  
  const extension = name.split('.').pop(); // masalan: mp4
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
  
  // Boshidan 12 ta va oxiridan 6 ta belgini olib birlashtiramiz
  const start = nameWithoutExt.slice(0, 15);
  const end = nameWithoutExt.slice(-5);
  
  return `${start}...${end}.${extension}`;
};

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

    if (fileRef.current) {
      fileRef.current.value = ''
    }
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
      updateLesson.mutate(
        {
          id: lesson.id,
          data: payload,
        },
        {
          onSuccess: onClose,
        }
      )
    } else {
      createLesson.mutate(payload, {
        onSuccess: onClose,
      })
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
              (o&apos;zgartirish uchun yuklang)
            </span>
          )}
        </Label>

        <div
          role='button'
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fileRef.current?.click()
            }
          }}
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed px-4 py-6 transition-all duration-200',
            'border-input hover:border-primary/60 hover:bg-muted/30',
            fileName && 'border-primary/40 bg-primary/5'
          )}
        >
          {fileName ? (
            <Video className='size-6 shrink-0 text-primary animate-in zoom-in-50' />
          ) : (
            <Upload className='size-6 shrink-0 text-muted-foreground' />
          )}

          <div className='w-full overflow-hidden px-2'>
            <p
              title={fileName} // Sishqonchani ustiga olib borganda to'liq nomi chiqadi
              className={cn(
                'w-full text-center text-sm transition-colors',
                fileName ? 'font-medium text-primary' : 'text-muted-foreground'
              )}
            >
              {fileName 
                ? formatFileName(fileName) 
                : 'Video faylni tanlash uchun bosing'}
            </p>
          </div>

          <p className='text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold'>
            MP4, MOV, AVI, MKV
          </p>
        </div>

        <input
          ref={fileRef}
          type='file'
          accept='video/*'
          onChange={handleFileChange}
          className='hidden'
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type='button'
          variant='outline'
          onClick={onClose}
          disabled={isPending}
          className="flex-1 sm:flex-none"
        >
          Bekor qilish
        </Button>

        <Button 
          type='submit' 
          disabled={isPending || !title.trim()}
          className="flex-1 sm:flex-none"
        >
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
          <DialogTitle>
            {lesson ? 'Darsni tahrirlash' : "Dars qo'shish"}
          </DialogTitle>
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