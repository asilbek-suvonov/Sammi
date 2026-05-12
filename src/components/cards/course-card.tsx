import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { levelVariant } from '@/lib/variants';
import { Link } from '@tanstack/react-router';
import { Layers3 } from 'lucide-react';
import type { Course } from '../../service/course/course.types'; // Yangi interfeysdan foydalanamiz

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link to='/course/$id' params={{ id: course.id.toString() }} className='group block'>
      <Card className='cursor-pointer overflow-hidden border dark:bg-neutral-900/30 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20'>
        
        <div className='relative overflow-hidden rounded-lg'>
          <img
            src={course.image_url ?? undefined}
            alt={course.title}
            className='h-45 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
          />
          <div className='absolute left-2.5 top-2.5'>
            <Badge 
              variant={levelVariant(course.level)} 
              className='rounded-md text-black dark:text-white bg-accent/80 text-[11px] backdrop-blur-md border border-white/10'
            >
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
              <Layers3 className='size-3' /> {course.category_name}
            </span>
            <span className='flex items-center gap-1'>
              <Layers3 className='size-3' /> {course.level}
            </span>
            <span className='flex items-center gap-1'>
              {/* <Layers3 className='size-3' /> {course.technologies_list.values[1]} */}
            </span>
            <span className='flex items-center gap-1'>
              {course.is_new && <Badge className="bg-green-500 h-4 text-[9px]">NEW</Badge>}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}