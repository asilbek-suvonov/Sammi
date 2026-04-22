import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useAuthStore } from '@/stores/auth-store'
import { useUserStore } from '@/stores/user-store'
import { COURSES } from '@/data/mock-data'
import { useTheme } from '@/context/theme-provider'
import {
  Check,
  ChevronDown,
  Clock3,
  Layers3,
  MessageCircle,
  Monitor,
  Moon,
  PlayCircle,
  Star,
  Sun,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/course/$id')({
  component: CourseDetailPage,
})

function levelVariant(level: string): 'secondary' | 'outline' | 'destructive' {
  if (level === 'Beginner') return 'secondary'
  if (level === 'Advanced') return 'destructive'
  return 'outline'
}

function CourseDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { enrollCourse, isEnrolled } = useUserStore()
  const { theme, setTheme } = useTheme()
  const user = auth.user
  const [openModules, setOpenModules] = useState<string[]>([])

  const course = COURSES.find((c) => c.id === id)
  const enrolled = course ? isEnrolled(course.id) : false

  if (!course) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground'>Course not found.</p>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    )
  }

  const handleWatch = () => {
    if (!user) {
      toast.error('Please sign in to watch this course.')
      return
    }
    if (!enrolled) enrollCourse(course.id)
    navigate({ to: '/course/preview', search: { courseId: course.id } })
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className='size-4' />
    if (theme === 'dark') return <Moon className='size-4' />
    return <Monitor className='size-4' />
  }

  const initials = (user?.firstName?.[0] ?? 'U').toUpperCase()

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>
          <Link to='/' className='flex items-center gap-2'>
            <div className='flex size-7 items-center justify-center rounded-md bg-foreground'>
              <Zap className='size-3.5 text-background' />
            </div>
            <span className='text-sm font-semibold tracking-tight'>Sammi</span>
          </Link>

          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' className='size-8'>
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className='size-4' /> Light {theme === 'light' && <Check className='ms-auto size-3.5' />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className='size-4' /> Dark {theme === 'dark' && <Check className='ms-auto size-3.5' />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className='size-4' /> System {theme === 'system' && <Check className='ms-auto size-3.5' />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user && (
              <Avatar className='size-8'>
                <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-4 py-10 md:px-6'>
        {/* Breadcrumb */}
        <nav className='mb-8 flex items-center gap-1.5 text-sm text-muted-foreground'>
          <Link to='/' className='transition-colors hover:text-foreground'>Home</Link>
          <span>/</span>
          <span className='text-foreground'>{course.title}</span>
        </nav>

        <div className='grid gap-10 lg:grid-cols-[1fr_340px]'>
          {/* Left side */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                <Badge variant={levelVariant(course.level)}>{course.level}</Badge>
                <Badge variant='outline'>{course.instructor}</Badge>
              </div>

              <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
                {course.title}
              </h1>

              <p className='text-base leading-relaxed text-muted-foreground'>
                {course.description}
              </p>

              <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                  <Star className='size-4 fill-amber-400 text-amber-400' />
                  {course.rating} rating
                </span>
                <span className='flex items-center gap-1.5'>
                  <Users className='size-4' />
                  {course.students.toLocaleString()} students
                </span>
                <span className='flex items-center gap-1.5'>
                  <Layers3 className='size-4' />
                  {course.parts} modules
                </span>
                <span className='flex items-center gap-1.5'>
                  <Clock3 className='size-4' />
                  {course.hours}h total
                </span>
              </div>
            </div>

            {/* Course image */}
            <div className='overflow-hidden rounded-xl border'>
              <img
                src={course.image}
                alt={course.title}
                className='h-64 w-full object-cover md:h-80'
              />
            </div>

            {/* Curriculum */}
            <div className='space-y-3'>
              <h2 className='text-xl font-semibold'>Course Curriculum</h2>
              <p className='text-sm text-muted-foreground'>
                {course.modules.length} modules • {totalLessons} lessons
              </p>

              <div className='space-y-2'>
                {course.modules.map((module, i) => {
                  const isOpen = openModules.includes(module.id)
                  return (
                    <Collapsible
                      key={module.id}
                      open={isOpen}
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50'>
                        <span className='flex items-center gap-2.5'>
                          <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold'>
                            {i + 1}
                          </span>
                          {module.title}
                          <span className='text-xs font-normal text-muted-foreground'>
                            {module.lessons.length} lessons
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className='mt-1 space-y-0.5 rounded-lg border bg-card px-3 py-2'>
                          {module.lessons.map((lesson) => (
                            <li
                              key={lesson.id}
                              className='flex items-center justify-between rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted/50'
                            >
                              <span className='flex items-center gap-2'>
                                <PlayCircle className='size-3.5 shrink-0' />
                                {lesson.title}
                              </span>
                              <span className='font-mono text-xs'>{lesson.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right side – sticky card */}
          <div className='lg:sticky lg:top-20 lg:self-start'>
            <div className='space-y-6 rounded-xl border bg-card p-6 shadow-sm'>
              <div>
                <p className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
                  Course Price
                </p>
                <p className='mt-1 text-4xl font-black'>{course.price}</p>
              </div>

              <div className='space-y-3'>
                <Button className='w-full gap-2' size='lg' onClick={handleWatch}>
                  <PlayCircle className='size-5' />
                  {enrolled ? 'Continue Watching' : 'Watch Course'}
                </Button>
                <Button variant='outline' className='w-full gap-2' size='lg'>
                  <MessageCircle className='size-5' /> Contact
                </Button>
              </div>

              <div className='space-y-3 border-t pt-4 text-sm'>
                {[
                  { label: 'Modules', value: course.modules.length },
                  { label: 'Total lessons', value: totalLessons },
                  { label: 'Duration', value: `${course.hours}h total` },
                  { label: 'Students', value: course.students.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>{label}</span>
                    <span className='font-medium'>{value}</span>
                  </div>
                ))}
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Level</span>
                  <Badge variant={levelVariant(course.level)} className='text-[11px]'>
                    {course.level}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Rating</span>
                  <span className='flex items-center gap-1 font-medium'>
                    <Star className='size-3.5 fill-amber-400 text-amber-400' />
                    {course.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
