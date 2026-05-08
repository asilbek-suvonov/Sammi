import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, SearchIcon } from 'lucide-react'
import { useCourses } from '@/api-hooks/course/use-courses'
import { levelVariant } from '@/lib/variants'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const UserCoursesView = () => {
  const [query, setQuery] = useState('')
  const { data: courses = [], isLoading } = useCourses({ search: query || undefined })

  return (
    <Main>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Courses</h1>
          <p className='text-sm text-muted-foreground'>
            Browse all available courses.
          </p>
        </div>
      </div>

      <Separator className='my-4' />

      <div className='mb-6'>
        <div className='relative w-full sm:w-64'>
          <SearchIcon className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search courses...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='pl-9'
          />
        </div>
      </div>

      {isLoading ? (
        <div className='py-12 text-center text-sm text-muted-foreground'>Yuklanmoqda...</div>
      ) : courses.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <SearchIcon className='mb-3 size-10 text-muted-foreground/50' />
          <p className='text-sm font-medium'>No courses found</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {courses.map((course) => (
            <div
              key={course.id}
              className='group overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md p-4'
            >
              <Link to='/course/$id' params={{ id: String(course.id) }}>
                <div className='relative h-45 overflow-hidden rounded-md'>
                  <img
                    src={course.image_url ?? undefined}
                    alt={course.title}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute left-2 top-2'>
                    <Badge
                      variant={levelVariant(course.level)}
                      className='bg-accent text-black dark:text-white text-[10px] capitalize'
                    >
                      {course.level}
                    </Badge>
                  </div>
                </div>
              </Link>
              <div className='p-3'>
                <Link
                  to='/course/$id'
                  params={{ id: String(course.id) }}
                  className='block text-sm font-medium leading-snug hover:underline'
                >
                  {course.title}
                </Link>
                <div className='mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground'>
                  {course.category_name && <span>{course.category_name}</span>}
                  <span>{course.is_free ? 'Free' : course.price}</span>
                </div>
                <div className='mt-3'>
                  <Link to='/course/$id' params={{ id: String(course.id) }}>
                    <Button size='sm' variant='outline' className='w-full text-xs'>
                      View Course
                      <ArrowRight className='ml-1.5 size-3.5' />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Main>
  )
}

export default UserCoursesView
