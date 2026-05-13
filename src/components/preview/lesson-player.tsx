import ReactPlayer from 'react-player'
import { CheckCircle, ChevronLeft, ChevronRight, VideoOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Lesson } from '@/service/lessons/lessons.types'

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url
  }
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`
}

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
  const lessonSrc = lesson ? resolveMediaUrl(lesson.video_url) : ''
  const src = lessonSrc || (lesson ? '' : resolveMediaUrl(previewUrl))
  const hasNoVideo = !!lesson && !lessonSrc
  const playerKey = lesson ? `lesson-${lesson.id}` : 'preview'

  return (
    <div className='flex w-full flex-col gap-4 sm:gap-5'>
      <div className='relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-lg shadow-black/10 ring-1 ring-black/5 dark:ring-white/5'>
        {hasNoVideo ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50'>
            <VideoOff className='size-8' />
            <p className='text-sm'>Bu darsda hali video yuklanmagan</p>
          </div>
        ) : src ? (
          <ReactPlayer
            key={playerKey}
            src={src}
            width='100%'
            height='100%'
            controls
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center text-sm text-white/50'>
            Video mavjud emas
          </div>
        )}
      </div>

      {lesson?.title ? (
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold leading-snug sm:text-xl'>
            {lesson.title}
          </h2>
          {lesson.duration_formatted && (
            <p className='text-xs text-muted-foreground'>
              Davomiyligi: {lesson.duration_formatted}
            </p>
          )}
        </div>
      ) : (
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold leading-snug sm:text-xl text-muted-foreground'>
            Kursni boshlash uchun darsni tanlang
          </h2>
        </div>
      )}

      {lesson && (
        <div className='grid grid-cols-3 gap-2 rounded-xl border bg-card p-2 shadow-sm sm:flex sm:items-center sm:justify-between sm:p-3'>
          <Button
            variant='outline'
            size='sm'
            disabled={!hasPrev}
            onClick={onPrev}
            className='gap-1.5 sm:min-w-28'
          >
            <ChevronLeft className='size-4' />
            <span className='hidden sm:inline'>Oldingi</span>
            <span className='sm:hidden'>Oldin</span>
          </Button>

          <Button
            variant={isCompleted ? 'secondary' : 'default'}
            size='sm'
            onClick={onMarkDone}
            disabled={isCompleted}
            className='gap-1.5 sm:min-w-48'
          >
            <CheckCircle className='size-4' />
            <span className='truncate'>
              {isCompleted ? "Ko'rildi" : "Ko'rildi deb belgilash"}
            </span>
          </Button>

          <Button
            variant='outline'
            size='sm'
            disabled={!hasNext}
            onClick={onNext}
            className='gap-1.5 sm:min-w-28'
          >
            <span className='hidden sm:inline'>Keyingi</span>
            <span className='sm:hidden'>Keyin</span>
            <ChevronRight className='size-4' />
          </Button>
        </div>
      )}
    </div>
  )
}
