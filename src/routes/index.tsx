/* eslint-disable react-refresh/only-export-components */
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
import { useTheme } from '@/context/theme-provider'
import { useAuthStore } from '@/stores/auth-store'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Check,
  Clock3,
  ExternalLink,
  FolderGit2,
  GitCommit,
  Languages,
  Layers3,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Star,
  Sun,
  Users,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n/i18n'

// ─── Data ──────────────────────────────────────────────────────────────────────

const courses = [
  {
    title: 'Frontend Foundations',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    parts: 12,
    hours: 36,
    price: '$149',
    level: 'Beginner',
    students: 1240,
    rating: 4.9,
  },
  {
    title: 'TypeScript Mastery',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
    parts: 10,
    hours: 28,
    price: '$129',
    level: 'Intermediate',
    students: 980,
    rating: 4.8,
  },
  {
    title: 'React Performance',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    parts: 9,
    hours: 24,
    price: '$119',
    level: 'Advanced',
    students: 750,
    rating: 4.9,
  },
  {
    title: 'Next.js Full-Stack',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&auto=format&fit=crop',
    parts: 14,
    hours: 42,
    price: '$169',
    level: 'Intermediate',
    students: 1540,
    rating: 5.0,
  },
  {
    title: 'TanStack Ecosystem',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    parts: 8,
    hours: 20,
    price: '$99',
    level: 'Advanced',
    students: 620,
    rating: 4.7,
  },
  {
    title: 'UI Design Systems',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800&auto=format&fit=crop',
    parts: 11,
    hours: 32,
    price: '$139',
    level: 'Intermediate',
    students: 890,
    rating: 4.8,
  },
]

const projects = [
  {
    title: 'SaaS Billing Dashboard',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=800&auto=format&fit=crop',
    tech: ['React', 'TanStack Router', 'Tailwind'],
    type: 'Full-Stack',
  },
  {
    title: 'Design System Starter',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    tech: ['TypeScript', 'Radix UI', 'Storybook'],
    type: 'Frontend',
  },
  {
    title: 'Analytics Portal',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    tech: ['Recharts', 'React Query', 'Zod'],
    type: 'Data',
  },
  {
    title: 'E-Commerce Platform',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
    tech: ['Next.js', 'Stripe', 'Prisma'],
    type: 'Full-Stack',
  },
  {
    title: 'Real-time Chat App',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=800&auto=format&fit=crop',
    tech: ['Socket.io', 'Redis', 'React'],
    type: 'Real-time',
  },
  {
    title: 'DevOps Dashboard',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    tech: ['Grafana API', 'Docker', 'TypeScript'],
    type: 'DevOps',
  },
]

const sources = [
  {
    title: 'Landing Repository',
    description: 'Responsive landing page source code',
    href: 'https://github.com',
    stars: 214,
  },
  {
    title: 'Dashboard Repository',
    description: 'Admin panel with role-based access',
    href: 'https://github.com',
    stars: 389,
  },
  {
    title: 'UI Components Repository',
    description: 'Shared shadcn/ui component library',
    href: 'https://github.com',
    stars: 157,
  },
]

const LANGUAGE_STORAGE_KEY = 'sammi_language'

function levelVariant(level: string): 'secondary' | 'outline' | 'destructive' {
  if (level === 'Beginner') return 'secondary'
  if (level === 'Advanced') return 'destructive'
  return 'outline'
}

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

  const { t } = useTranslation()

  const navLinks = [
    { id: 'courses', label: t("navCourses") },
    { id: 'projects', label: t("navProjects") },
    { id: 'sources', label: t("navSources") },
  ]

  const linkClass = useMemo(
    () => (id: string) =>
      `px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
        active === id
          ? 'text-gray-900/80 bg-white '
          : 'text-muted-foreground hover:text-foreground '
      }`,
    [active]
  )

  const scrollToSection = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ✅ til o'zgarganda i18n.changeLanguage ham chaqiriladi
  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, value)
    i18n.changeLanguage(value)
  }

  const initials = (user?.firstName?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase()

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className='size-4' />
    if (theme === 'dark') return <Moon className='size-4' />
    return <Monitor className='size-4' />
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>

          <div className='flex items-center gap-2'>
            <div className='flex size-7 items-center justify-center rounded-md bg-foreground'>
              <Zap className='size-3.5 text-background' />
            </div>
            <span className='text-sm font-semibold tracking-tight'>Sammi</span>
          </div>

          <nav className='hidden items-center gap-0.5 md:flex'>
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

          <div className='flex items-center gap-2'>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className='hidden h-8 w-[110px] gap-1.5 text-xs md:flex'>
                <Languages className='size-3.5 shrink-0' />
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
                <Button variant='outline' size='icon' className='size-8'>
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-36'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className='size-4' /> Light
                  {theme === 'light' && <Check className='ms-auto size-3.5' />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className='size-4' /> Dark
                  {theme === 'dark' && <Check className='ms-auto size-3.5' />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className='size-4' /> System
                  {theme === 'system' && <Check className='ms-auto size-3.5' />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-auto rounded-full p-0'>
                    <Avatar className='size-8'>
                      <AvatarImage src='/avatars/shadcn.jpg' alt={user.email} />
                      <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
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
                    <LayoutDashboard className='size-4' /> {t('dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant='destructive'
                    onClick={() => { auth.reset(); navigate({ to: '/' }) }}
                  >
                    <LogOut className='size-4' /> {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size='sm' className='h-8 rounded-lg text-xs'>
                <Link to='/login'>{t('sign')}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <section className='border-b'></section>
      <main className='mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 md:px-6'>
        <section id='courses' className='space-y-6'>
          <div className='flex items-end justify-between'>
            <div className='space-y-0.5'>
              <h2 className='text-xl font-semibold tracking-tight'>{t('coursesTitle')}</h2>
              <p className='text-sm text-muted-foreground'>{t('coursesSubtitle')}</p>
            </div>
            <Button variant='ghost' size='sm' className='hidden gap-1.5 text-xs text-muted-foreground md:flex'>
              {t('coursesAll')} <ExternalLink className='size-3' />
            </Button>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
            {courses.map((course) => (
              <Card
                key={course.title}
                className='group cursor-pointer gap-0 overflow-hidden p-3 transition-shadow duration-200 bg-neutral-800/40 hover:shadow-md'
              >
                <div className='relative overflow-hidden'>
                  <img
                    src={course.image}
                    alt={course.title}
                    className='h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] rounded-md'
                  />
                  <div className='absolute left-2.5 top-2.5'>
                    <Badge variant={levelVariant(course.level)} className='rounded-md bg-accent text-[11px]'>
                      {course.level}
                    </Badge>
                  </div>
                </div>

                <CardHeader className='px-2 pt-4 pb-2'>
                  <CardTitle className='flex items-start gap-2 text-[14px] font-medium leading-snug'>
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className='space-y-3 px-2 pb-4'>
                  <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Layers3 className='size-3' /> {course.parts} {t('coursesLessons')}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Clock3 className='size-3' /> {course.hours}s
                    </span>
                    <span className='flex items-center gap-1'>
                      <Users className='size-3' /> {course.students.toLocaleString()}
                    </span>
                  </div>

                  <div className='flex items-center justify-between border-t pt-3'>
                    <span className='flex items-center gap-1 text-sm font-semibold'>
                      {course.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects */}
<section id='projects' className='space-y-6'>
  <div className='flex items-end justify-between'>
    <div className='space-y-0.5'>
      <h2 className='text-xl font-semibold tracking-tight'>{t('projectsTitle')}</h2>
      <p className='text-sm text-muted-foreground'>{t('projectsSubtitle')}</p>
    </div>
    <Button variant='ghost' size='sm' className='hidden gap-1.5 text-xs text-muted-foreground md:flex'>
      {t('projectsAll')} <ExternalLink className='size-3' />
    </Button>
  </div>
  <div>
    <Button
      variant="ghost"
      size="sm"
      className="hidden items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground md:flex"
    >
      Barchasi
      <ExternalLink className="size-3" />
    </Button>
  </div>

  {/* 🔹 Grid */}
  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
    {projects.map((project) => (
      <Card
        key={project.title}
        className="group relative gap-3 overflow-hidden border p-0 backdrop-blur transition-all duration-300 bg-neutral-800/40 hover:shadow-md "
      >
        
        {/* 🔸 Image */}
        <div className="relative overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Type badge */}
          <span className="absolute right-3 top-3 rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
            {project.type}
          </span>

          {/* Title */}
        </div>
          <p className=" text-sm font-semibold text-white px-4 py-0">
            {project.title}
          </p>

        {/* 🔸 Content */}
        <CardContent className="space-y-2 p-4 pt-0">
          
          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="rounded-md px-2 py-0.5 text-[11px]"
              >
                {item}
              </Badge>
            ))}
          </div>

          
        </CardContent>
      </Card>
    ))}
  </div>
</section>

        {/* Sources */}
        <section id='sources' className='space-y-6'>
          <div className='space-y-0.5'>
            <h2 className='text-xl font-semibold tracking-tight'>{t('sourcesTitle')}</h2>
            <p className='text-sm text-muted-foreground'>{t('sourcesSubtitle')}</p>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            {sources.map((source) => (
              <Card key={source.title} className='transition-shadow duration-200 hover:shadow-md'>
                <CardHeader className='pb-2'>
                  <CardTitle className='flex items-center gap-2 text-[14px] font-medium'>
                    <FolderGit2 className='size-4 text-muted-foreground' />
                    {source.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-sm text-muted-foreground'>{source.description}</p>
                  <div className='flex items-center justify-between border-t pt-3'>
                    <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <Star className='size-3 fill-amber-400 text-amber-400' />
                      {source.stars}
                    </span>
                    <a
                      href={source.href}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
                    >
                      <GitCommit className='size-3.5' />
                      GitHub
                      <ExternalLink className='size-3' />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className='border-t'>
        <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
          <div className='grid gap-8 md:grid-cols-4'>
            <div className='space-y-3 md:col-span-1'>
              <div className='flex items-center gap-2'>
                <div className='flex size-6 items-center justify-center rounded-md bg-foreground'>
                  <Zap className='size-3 text-background' />
                </div>
                <span className='text-sm font-semibold'>Sammi</span>
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {t('footerDescription')}
              </p>
            </div>

            {[
              { title: 'Platform', items: ['Courses', 'Projects', 'Code Sources'] },
              { title: 'Support', items: ['Help Center', 'Documentation', 'Community'] },
              { title: 'Legal', items: ['Terms of Service', 'Privacy Policy'] },
            ].map((col) => (
              <div key={col.title} className='space-y-3'>
                <p className='text-sm font-medium'>{col.title}</p>
                <ul className='space-y-2'>
                  {col.items.map((item) => (
                    <li key={item} className='cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground'>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className='mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center'>
            <span>© {new Date().getFullYear()} Sammi. {t('footerRights')}</span>
            <a href='https://github.com' target='_blank' rel='noreferrer' className='flex items-center gap-1.5 transition-colors hover:text-foreground'>
              <GitCommit className='size-3.5' /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}