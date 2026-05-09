import ReactPlayer from 'react-player'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Lesson } from '@/service/lessons/lessons.types'

interface Props {
  lesson: Lesson | null
  previewUrl?: string | null
  hasPrev: boolean
  hasNext: boolean
  isCompleted: boolean
  onPrev: () => void
  onNext: () => void
  onMarkDone: () => void
}

export function LessonPlayer({
  lesson,
  previewUrl,
  hasPrev,
  hasNext,
  isCompleted,
  onPrev,
  onNext,
  onMarkDone,
}: Props) {
  const src = lesson?.video_url || previewUrl || ''

  return (
    <div className='flex flex-col gap-3'>
      <div className='relative w-full overflow-hidden rounded-xl border bg-black pb-[56.25%] shadow-sm'>
        {src ? (
          <ReactPlayer
            key={src}
            src={src}
            width='100%'
            height='100%'
            controls
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center text-sm text-white/60'>
            Video mavjud emas
          </div>
        )}
      </div>

      {lesson?.title && (
        <h2 className='text-base font-semibold leading-snug'>{lesson.title}</h2>
      )}

      {lesson && (
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={!hasPrev}
            onClick={onPrev}
            className='gap-1.5'
          >
            <ChevronLeft className='size-4' />
            Oldingi
          </Button>
          <Button
            variant={isCompleted ? 'secondary' : 'default'}
            size='sm'
            onClick={onMarkDone}
            className='gap-1.5'
          >
            <CheckCircle className='size-4' />
            Ko'rildi
          </Button>
          <Button
            variant='outline'
            size='sm'
            disabled={!hasNext}
            onClick={onNext}
            className='gap-1.5'
          >
            Keyingi
            <ChevronRight className='size-4' />
          </Button>
        </div>
      )}
    </div>
  )
}
