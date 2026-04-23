import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Course } from '@/data/mock-data'
import { levelVariant } from '@/lib/variants'
import { Link } from '@tanstack/react-router'
import { Clock3, Layers3, Star, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function CourseCard({ course }: { course: Course }) {
  const { t } = useTranslation()

  return (
    <Link to='/course/$id' params={{ id: course.id }} className='group block'>
      <Card className='cursor-pointer gap-0 overflow-hidden p-3 transition-all duration-200 bg-neutral-800/40 hover:shadow-md hover:-translate-y-0.5'>
        <div className='relative overflow-hidden'>
          <img
            src={course.image}
            alt={course.title}
            className='h-40 w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-[1.03]'
          />  
          <div className='absolute left-2.5 top-2.5'>
            <Badge variant={levelVariant(course.level)} className='rounded-md bg-accent text-[11px]'>
              {course.level}
            </Badge>
          </div>
        </div>

        <CardHeader className='px-2 pb-2 pt-4'>
          <CardTitle className='text-[14px] font-medium leading-snug'>
            {course.title}
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-3 px-2 pb-4'>
          <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <Layers3 className='size-3' /> {course.parts} {t('coursesLessons')}
            </span>
            <span className='flex items-center gap-1'>
              <Clock3 className='size-3' /> {course.hours}h
            </span>
            <span className='flex items-center gap-1'>
              <Users className='size-3' /> {course.students.toLocaleString()}
            </span>
          </div>
          <div className='flex items-center justify-between border-t pt-3'>
            <span className='text-sm font-semibold'>{course.price}</span>
            <span className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Star className='size-3 fill-amber-400 text-amber-400' /> {course.rating}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
