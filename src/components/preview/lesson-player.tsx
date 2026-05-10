import ReactPlayer from 'react-player'
import { CheckCircle, ChevronLeft, ChevronRight, VideoOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Lesson } from '@/service/lessons/lessons.types'

// Backend often returns relative paths like /media/lessons/video.mp4.
// Prepend the API origin so the browser can load them from the correct server.
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
  // When a lesson is selected, only use that lesson's video (don't fall back to preview).
  // When no lesson is selected, show the course preview video.
  const lessonSrc = lesson ? resolveMediaUrl(lesson.video_url) : ''
  const src = lessonSrc || (lesson ? '' : resolveMediaUrl(previewUrl))

  const hasNoVideo = !!lesson && !lessonSrc

  // Re-mount ReactPlayer whenever the lesson changes so the new video loads cleanly.
  const playerKey = lesson ? `lesson-${lesson.id}` : 'preview'

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-sm'>
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

      {lesson?.title && (
        <h2 className='text-base font-semibold leading-snug'>{lesson.title}</h2>
      )}

      {lesson && (
        <div className='flex w-full items-center justify-between gap-2'>
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
            disabled={isCompleted}
            className='gap-1.5'
          >
            <CheckCircle className='size-4' />
            {isCompleted ? "Ko'rildi" : "Ko'rildi deb belgilash"}
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
