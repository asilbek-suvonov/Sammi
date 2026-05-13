import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import type { Course } from '@/service/course/course.types'

export interface ProgressCardProps {
  course: Course
  completed: number
  total: number
}

export function ProgressCard({ course, completed, total }: ProgressCardProps) {
  const safeTotal = Math.max(total, 1)
  const percent = Math.min(100, Math.round((completed / safeTotal) * 100))

  return (
    <Link
      to='/course/preview'
      search={{ courseId: String(course.id),  }}
      className='group block overflow-hidden rounded-xl border bg-card p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'
    >
      <div className='relative aspect-video overflow-hidden rounded-lg bg-muted'>
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <BookOpen className='size-8 text-muted-foreground/40' />
          </div>
        )}
      </div>

      <div className='space-y-2 pt-3'>
        <p className='line-clamp-2 text-sm font-medium leading-tight'>
          {course.title}
        </p>

        <div className='space-y-1'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>
              {completed} / {total || '?'} darslar
            </span>
            <span className='font-medium text-foreground'>{percent}%</span>
          </div>
          <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
            <div
              className='h-full rounded-full bg-primary transition-all duration-500'
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
