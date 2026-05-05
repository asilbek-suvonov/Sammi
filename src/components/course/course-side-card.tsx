import { ContactDialog } from '@/components/contact-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Course } from '@/service/course/course.types'
import { levelVariant } from '@/lib/variants'

interface CourseSideCardProps {
  course: Course
  enrolled?: boolean
  onWatch?: () => void
}

export function CourseSideCard({
  course,
  enrolled = false,
  onWatch,
}: CourseSideCardProps) {
  return (
    <div className='lg:sticky lg:top-20 lg:self-start'>
      <div className='space-y-6 rounded-xl border bg-card p-6 shadow-sm'>
        <div className='space-y-1'>
          <p className='text-xs font-medium tracking-widest text-muted-foreground uppercase'>
            Course Price
          </p>
          <p className='text-3xl font-semibold text-foreground'>
            {course.is_free ? 'Free' : course.price}
          </p>
        </div>

        <div className='space-y-3'>
          <Button className='w-full' size='lg' onClick={() => onWatch?.()}>
            {enrolled ? 'Continue Watching' : 'Watch Course'}
          </Button>

          <ContactDialog
            subject={course.title}
            trigger={
              <Button variant='outline' className='w-full' size='lg'>
                Contact
              </Button>
            }
          />
        </div>

        <div className='space-y-4 border-t pt-4 text-sm'>
          <InfoRow label='Category' value={course.category_name || '—'} />
          <InfoRow
            label='Technologies'
            value={course.technologies_list?.length ? course.technologies_list.join(', ') : '—'}
          />
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Level</span>
            <Badge
              variant={levelVariant(course.level)}
              className='text-[11px] capitalize'
            >
              {course.level}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <span className='shrink-0 text-muted-foreground'>{label}</span>
      <span className='truncate text-right font-medium text-foreground'>{value}</span>
    </div>
  )
}
