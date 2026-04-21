import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock3, Layers3, PlayCircle } from 'lucide-react'

const enrolledCourses = [
  {
    id: 1,
    title: 'Frontend Foundations',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    progress: 68,
    lessons: 12,
    hours: 36,
    level: 'Beginner',
  },
  {
    id: 2,
    title: 'TypeScript Mastery',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
    progress: 30,
    lessons: 10,
    hours: 28,
    level: 'Intermediate',
  },
  {
    id: 3,
    title: 'React Performance',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    progress: 0,
    lessons: 9,
    hours: 24,
    level: 'Advanced',
  },
]

export function UserCourses() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Mening kurslarim</h2>
          <p className='text-muted-foreground'>Ro'yxatdan o'tgan kurslaringizni ko'ring.</p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {enrolledCourses.map((course) => (
            <Card key={course.id} className='group overflow-hidden gap-0 p-0'>
              <div className='relative overflow-hidden'>
                <img
                  src={course.image}
                  alt={course.title}
                  className='h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-black/30' />
                <Badge
                  variant='secondary'
                  className='absolute left-2.5 top-2.5 text-[10px]'
                >
                  {course.level}
                </Badge>
              </div>
              <CardHeader className='px-4 pt-4 pb-2'>
                <CardTitle className='text-sm font-medium'>{course.title}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 px-4 pb-4'>
                <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <Layers3 className='size-3' /> {course.lessons} dars
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock3 className='size-3' /> {course.hours}s
                  </span>
                </div>

                <div className='space-y-1'>
                  <div className='flex justify-between text-xs text-muted-foreground'>
                    <span>Jarayon</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className='h-1.5 w-full rounded-full bg-muted'>
                    <div
                      className='h-full rounded-full bg-primary transition-all'
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <Button size='sm' variant='outline' className='w-full gap-2 text-xs'>
                  <PlayCircle className='size-3.5' />
                  {course.progress > 0 ? 'Davom etish' : 'Boshlash'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}
