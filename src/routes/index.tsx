/* eslint-disable react-refresh/only-export-components */
import { useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { BookOpen, Check, Clock3, FolderGit2, Languages, Layers3, LayoutDashboard, LogOut, Moon, Sun, Tag } from 'lucide-react'
import { IconGithub } from '@/assets/brand-icons'
import { useTheme } from '@/context/theme-provider'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const courses = [
  {
    title: 'Frontend Foundations',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    parts: 12,
    hours: 36,
    price: '$149',
  },
  {
    title: 'TypeScript Mastery',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop',
    parts: 10,
    hours: 28,
    price: '$129',
  },
  {
    title: 'React Performance',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    parts: 9,
    hours: 24,
    price: '$119',
  },
]

const projects = [
  {
    title: 'SaaS Billing Dashboard',
    image:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=1200&auto=format&fit=crop',
    tech: ['React', 'TanStack Router', 'Tailwind'],
  },
  {
    title: 'Design System Starter',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    tech: ['TypeScript', 'Radix UI', 'Storybook'],
  },
  {
    title: 'Analytics Portal',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    tech: ['Recharts', 'React Query', 'Zod'],
  },
]

const sources = [
  { title: 'Landing Repository', href: 'https://github.com' },
  { title: 'Dashboard Repository', href: 'https://github.com' },
  { title: 'UI Components Repository', href: 'https://github.com' },
]

const navLinks = [
  { id: 'courses', label: 'Course' },
  { id: 'projects', label: 'Project' },
  { id: 'sources', label: 'Manba' },
]
const LANGUAGE_STORAGE_KEY = 'sammi_language'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [active, setActive] = useState('courses')
  const [language, setLanguage] = useState(
    () => localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? 'en'
  )
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const user = auth.user

  const linkClass = useMemo(
    () => (id: string) =>
      `text-sm transition-colors ${
        active === id
          ? 'text-foreground font-semibold'
          : 'text-muted-foreground hover:text-foreground'
      }`,
    [active]
  )

  const scrollToSection = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, value)
  }

  const initials = (
    user?.firstName?.[0] ??
    user?.email?.[0] ??
    'U'
  ).toUpperCase()

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <header className='border-b'>
        <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6'>
          <p className='text-lg font-semibold'>Sammi</p>
          <nav className='hidden items-center gap-6 md:flex'>
            {navLinks.map((link) => (
              <button
                type='button'
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={linkClass(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className='hidden items-center gap-2 md:flex'>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className='h-8 w-[120px] text-xs'>
                <Languages className='size-4' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='en'>English</SelectItem>
                <SelectItem value='uz'>Uzbek</SelectItem>
                <SelectItem value='ru'>Russian</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  Theme
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className='size-4' />
                  Light
                  {theme === 'light' ? <Check className='ms-auto size-4' /> : null}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className='size-4' />
                  Dark
                  {theme === 'dark' ? <Check className='ms-auto size-4' /> : null}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                  {theme === 'system' ? <Check className='ms-auto size-4' /> : null}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-auto rounded-full p-0'>
                  <Avatar>
                    <AvatarImage src='/avatars/shadcn.jpg' alt={user.email} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                  <p className='truncate text-sm'>{`${user.firstName} ${user.lastName}`}</p>
                  <p className='text-xs text-muted-foreground'>{user.email}</p>
                  <p className='text-xs text-muted-foreground'>Role: {user.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/overview' })}>
                  <LayoutDashboard className='size-4' />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className='size-4' />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className='size-4' />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant='destructive'
                  onClick={() => {
                    auth.reset()
                    navigate({ to: '/' })
                  }}
                >
                  <LogOut className='size-4' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to='/login'>Kirish</Link>
            </Button>
          )}
        </div>
      </header>

      <main className='mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-16 md:px-6'>
        <section className='space-y-6'>
          <Badge variant='secondary'>Modern SaaS Frontend</Badge>
          <h1 className='max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl'>
            Build polished products with clean architecture and scalable UI.
          </h1>
          <p className='max-w-2xl text-lg text-muted-foreground'>
            Production-ready React + TanStack Router starter with role-based access,
            modern auth, and reusable UI patterns.
          </p>
          <div className='flex gap-3'>
            <Button asChild>
              <a href='#courses'>Explore Courses</a>
            </Button>
            <Button variant='outline' asChild>
              <a href='#projects'>View Projects</a>
            </Button>
          </div>
        </section>

        <section id='courses' className='space-y-6'>
          <h2 className='text-2xl font-semibold'>Courses</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {courses.map((course) => (
              <Card key={course.title}>
                <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BookOpen className='size-4' />
                  {course.title}
                </CardTitle>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                  <img
                    src={course.image}
                    alt={course.title}
                    className='mb-4 h-36 w-full rounded-md object-cover'
                  />
                  <div className='space-y-1'>
                    <p className='flex items-center gap-2'>
                      <Layers3 className='size-4' />
                      {course.parts} parts
                    </p>
                    <p className='flex items-center gap-2'>
                      <Clock3 className='size-4' />
                      {course.hours} hours
                    </p>
                    <p className='flex items-center gap-2 font-medium text-foreground'>
                      <Tag className='size-4' />
                      {course.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id='projects' className='space-y-6'>
          <h2 className='text-2xl font-semibold'>Projects</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {projects.map((project) => (
              <Card key={project.title}>
                <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                  <img
                    src={project.image}
                    alt={project.title}
                    className='mb-4 h-36 w-full rounded-md object-cover'
                  />
                  <div className='flex flex-wrap gap-2'>
                    {project.tech.map((item) => (
                      <Badge key={item} variant='secondary'>
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id='sources' className='space-y-6'>
          <h2 className='text-2xl font-semibold'>Manbalar</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {sources.map((source) => (
              <Card key={source.title}>
                <CardHeader>
                  <CardTitle>{source.title}</CardTitle>
                </CardHeader>
                <CardContent className='flex items-center gap-3'>
                  <FolderGit2 className='size-5 text-muted-foreground' />
                  <a
                    href={source.href}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-2 text-sm font-medium hover:underline'
                  >
                    <IconGithub className='size-4' />
                    GitHub
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className='border-t py-12'>
        <div className='mx-auto grid w-full max-w-6xl gap-8 px-4 text-sm text-muted-foreground md:grid-cols-4 md:px-6'>
          <div className='space-y-2'>
            <p className='text-base font-semibold text-foreground'>Sammi</p>
            <p>
              Professional frontend learning platform with scalable architecture
              and practical project workflow.
            </p>
          </div>
          <div className='space-y-2'>
            <p className='font-semibold text-foreground'>Platform</p>
            <p>Courses</p>
            <p>Projects</p>
            <p>Code Sources</p>
          </div>
          <div className='space-y-2'>
            <p className='font-semibold text-foreground'>Support</p>
            <p>Help Center</p>
            <p>Documentation</p>
            <p>Community</p>
          </div>
          <div className='space-y-2'>
            <p className='font-semibold text-foreground'>Legal</p>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
            <p>© {new Date().getFullYear()} Sammi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
