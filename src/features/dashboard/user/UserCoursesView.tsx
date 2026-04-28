import { useState, useMemo } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAdminStore } from '@/stores/admin-store'
import { Link } from '@tanstack/react-router'
import { levelVariant } from '@/lib/variants'
import {
  Clock,
  Layers3,
  SearchIcon,
  Users,
  ArrowRight,
} from 'lucide-react'

const UserCoursesView = () => {
  const { courses } = useAdminStore()
  const [query, setQuery] = useState('')

  const filteredCourses = useMemo(() => {
    const q = query.toLowerCase()
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.category ?? '').toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
    )
  }, [query, courses])

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

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

        {/* Search Row */}
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

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
            <SearchIcon className='mb-3 size-10 text-muted-foreground/50' />
            <p className='text-sm font-medium'>No courses found</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className='group overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md'
              >
                <Link to='/course/$id' params={{ id: course.id }}>
                  <div className='relative h-36 overflow-hidden'>
                    <img
                      src={course.image}
                      alt={course.title}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                    <div className='absolute left-2 top-2'>
                      <Badge
                        variant={levelVariant(course.level)}
                        className='bg-accent text-black dark:text-white text-[10px]'
                      >
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                </Link>
                <div className='p-3'>
                  <Link
                    to='/course/$id'
                    params={{ id: course.id }}
                    className='block text-sm font-medium leading-snug hover:underline'
                  >
                    {course.title}
                  </Link>
                  <div className='mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Layers3 className='size-3' /> {course.parts} lessons
                    </span>
                    <span className='flex items-center gap-1'>
                      <Clock className='size-3' /> {course.hours}h
                    </span>
                    <span className='flex items-center gap-1'>
                      <Users className='size-3' /> {course.students.toLocaleString()}
                    </span>
                  </div>
                  <div className='mt-3'>
                    <Link to='/course/$id' params={{ id: course.id }}>
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
    </>
  )
}

export default UserCoursesView