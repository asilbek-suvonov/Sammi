import { Button } from '@/components/ui/button'
import type { Lesson } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import { Check, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactPlayer from 'react-player'

const SAMPLE_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

interface LessonPlayerProps {
  lesson: Lesson | undefined
  lessonIndex: number
  totalLessons: number
  isCurrentWatched: boolean
  justWatched: boolean
  hasPrev: boolean
  courseProgress: number
  watchedCount: number
  onMarkWatched: () => void
  onPrev: () => void
  onNext: () => void
  onVideoEnded: () => void
}

export function LessonPlayer({
  lesson, lessonIndex, totalLessons,
  isCurrentWatched, justWatched, hasPrev,
  courseProgress, watchedCount, onMarkWatched, onPrev, onNext, onVideoEnded,
}: LessonPlayerProps) {
  return (
    <div className='mx-auto max-w-6xl px-4 py-6 md:px-6'>
      <div className='overflow-hidden rounded-xl border bg-black shadow-sm'>
        <div className='aspect-video w-full'>
          <ReactPlayer
            key={lesson?.id ?? 'no-lesson'}
            src={SAMPLE_VIDEO}
            width='100%'
            height='100%'
            controls
            onEnded={onVideoEnded}
          />
        </div>
      </div>

      <div className='mt-4 space-y-3'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0'>
            <p className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
              {lessonIndex + 1}-dars / {totalLessons} ta
            </p>
            <h2 className='mt-1 text-xl font-semibold leading-snug'>{lesson?.title}</h2>
          </div>
          {(justWatched || isCurrentWatched) && (
            <div className={cn('flex shrink-0 items-center gap-1.5 rounded-full border border-green-500/30 bg-green-50 px-3 py-1.5 text-green-700 dark:bg-green-500/10 dark:text-green-400', justWatched && 'animate-in fade-in zoom-in-95 duration-300')}>
              <CheckCircle2 className='size-4' />
              <span className='text-xs font-medium'>Ko'rilgan</span>
            </div>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button variant='outline' size='sm' onClick={onPrev} disabled={!hasPrev} className='gap-1.5'>
            <ChevronLeft className='size-4' /> Oldingi
          </Button>
          {!isCurrentWatched ? (
            <Button variant='secondary' size='sm' onClick={onMarkWatched} className='gap-1.5'>
              <CheckCircle2 className='size-4' /> Ko'rilgan
            </Button>
          ) : (
            <div className='flex h-8 items-center gap-1.5 rounded-md bg-muted px-3 text-xs text-muted-foreground'>
              <Check className='size-3.5 text-green-500' /> Ko'rilgan
            </div>
          )}
          <Button size='sm' onClick={onNext} className='gap-1.5'>
            Keyingi <ChevronRight className='size-4' />
          </Button>
        </div>

        <div className='rounded-lg border bg-muted/30 px-4 py-3'>
          <div className='mb-2 flex items-center justify-between text-xs'>
            <span className='font-medium text-foreground'>Kurs jarayoni</span>
            <span className='text-muted-foreground'>{watchedCount} / {totalLessons} dars</span>
          </div>
          <div className='h-2 overflow-hidden rounded-full bg-muted'>
            <div
              className='h-full rounded-full bg-primary transition-all duration-500'
              style={{ width: `${courseProgress}%` }}
            />
          </div>
          <p className='mt-1.5 text-right text-xs font-semibold text-primary'>{courseProgress}%</p>
        </div>
      </div>
    </div>
  )
}
