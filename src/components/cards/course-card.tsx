import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Course } from '@/data/mock-data'
import { levelVariant } from '@/lib/variants'
import { Link } from '@tanstack/react-router'
import { Clock3, Layers3, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function CourseCard({ course }: { course: Course }) {
  const { t } = useTranslation()

  return (
    <Link to='/course/$id' params={{ id: course.id }} className='group block'>
      {/* Card: border va backdrop-blur qo'shildi */}
      <Card className='cursor-pointer overflow-hidden border border-neutral-700/50 dark:bg-neutral-900/30 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-2xl hover:shadow-black/20'>
        
        <div className='relative overflow-hidden rounded-lg'>
          <img
            src={course.image}
            alt={course.title}
            className='h-45 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
          />  
          <div className='absolute left-2.5 top-2.5'>
            <Badge variant={levelVariant(course.level)} className='rounded-md text-black dark:text-white bg-accent text-[11px] backdrop-blur-md'>
              {course.level}
            </Badge>
          </div>
        </div>

        <CardHeader className='px-2 pb-2 pt-4'>
          <CardTitle className='text-[14px] font-medium leading-snug'>
            {course.title}
          </CardTitle>
        </CardHeader>

        <CardContent className='px-2 pb-2'>
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
          
        </CardContent>
      </Card>
    </Link>
  )
}