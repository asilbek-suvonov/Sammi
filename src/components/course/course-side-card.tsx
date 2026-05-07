import { ContactDialog } from '@/components/contact-dialog'
import { Button } from '@/components/ui/button'
import type { Course } from '@/service/course/course.types'

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
          <p className='text-xs font-medium tracking-widest text-muted-foreground '>
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

      </div>
    </div>
  )
}

