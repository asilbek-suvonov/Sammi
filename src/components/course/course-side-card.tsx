import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Course } from '@/data/mock-data'
import { levelVariant } from '@/lib/variants'
import { Star } from 'lucide-react'

interface CourseSideCardProps {
  course: Course
  totalLessons?: number
  enrolled?: boolean
  onWatch?: () => void
}

export function CourseSideCard({
  course,
  totalLessons = 0,
  enrolled = false,
  onWatch,
}: CourseSideCardProps) {
  return (
    <div className='lg:sticky lg:top-20 lg:self-start'>
      <div className='space-y-6 rounded-xl border bg-card p-6 shadow-sm'>
        
        {/* PRICE */}
        <div>
          <p className='text-xs font-medium  tracking-widest text-muted-foreground'>
            Course Price
          </p>
          <p className='mt-1 text-3xl font-medium'>
            {course?.price ?? '$0'}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className='space-y-3'>
          <Button
            className='w-full gap-2'
            size='lg'
            onClick={() => onWatch?.()}
          >
            {enrolled ? 'Continue Watching' : 'Watch Course'}
          </Button>

          <Button variant='outline' className='w-full gap-2' size='lg'>
            Contact
          </Button>
        </div>

        {/* COURSE INFO */}
        <div className='space-y-3 border-t pt-4 text-sm'>
          {[
            {
              label: 'Modules',
              value: course?.modules?.length ?? 0,
            },
            {
              label: 'Total lessons',
              value: totalLessons,
            },
            {
              label: 'Duration',
              value: `${course?.hours ?? 0}h total`,
            },
            {
              label: 'Students',
              value: course?.students
                ? course.students.toLocaleString()
                : '0',
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className='flex items-center justify-between'
            >
              <span className='text-muted-foreground'>
                {label}
              </span>
              <span className='font-medium'>{value}</span>
            </div>
          ))}

          {/* LEVEL */}
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Level</span>
            <Badge
              variant={levelVariant(course?.level ?? 'beginner')}
              className='text-[11px]'
            >
              {course?.level ?? 'beginner'}
            </Badge>
          </div>

          {/* RATING */}
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Rating</span>
            <span className='flex items-center gap-1 font-medium'>
              <Star className='size-3.5 fill-amber-400 text-amber-400' />
              {course?.rating ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}