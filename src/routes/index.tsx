/* eslint-disable react-refresh/only-export-components */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useTheme } from '@/context/theme-provider'
import { COURSES, PROJECTS } from '@/data/mock-data'
import { useAuthStore } from '@/stores/auth-store'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Check,
  Clock3,
  ExternalLink,
  FolderGit2,
  GitCommit,
  Languages,
  LayoutDashboard,
  Layers3,
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
import { IconGithub } from '@/assets/brand-icons'
import { IconGoogle } from '@/assets/brand-icons/icon-google'
import { toast } from 'sonner'

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
  const [signInOpen, setSignInOpen] = useState(false)
  const [emailStep, setEmailStep] = useState(false)
  const [email, setEmail] = useState('')

  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const user = auth.user
  const { t } = useTranslation()

  const navLinks = [
    { id: 'courses', label: t('navCourses') },
    { id: 'projects', label: t('navProjects') },
    { id: 'sources', label: t('navSources') },
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

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, value)
    i18n.changeLanguage(value)
  }

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email.')
      return
    }
    sessionStorage.setItem('sammi_pending_email', email)
    setSignInOpen(false)
    setEmail('')
    setEmailStep(false)
    navigate({ to: '/otp' })
  }

  const handleModalClose = (open: boolean) => {
    setSignInOpen(open)
    if (!open) {
      setEmailStep(false)
      setEmail('')
    }
  }

  const initials = (user?.firstName?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase()

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className='size-4' />
    if (theme === 'dark') return <Moon className='size-4' />
    return <Monitor className='size-4' />
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>

      {/* ─── Sign In Modal ──────────────────────────────────────────────── */}
      <Dialog open={signInOpen} onOpenChange={handleModalClose}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Welcome to Sammi</DialogTitle>
            <DialogDescription>
              {emailStep
                ? 'Enter your email to receive a verification code.'
                : 'Sign in to access courses and track progress.'}
            </DialogDescription>
          </DialogHeader>

          {!emailStep ? (
            <div className='space-y-3 pt-2'>
              <Button
                variant='outline'
                className='w-full gap-2'
                onClick={() => toast.info('Google auth coming soon!')}
              >
                <IconGoogle className='size-4' /> Continue with Google
              </Button>
              <Button
                variant='outline'
                className='w-full gap-2'
                onClick={() => toast.info('GitHub auth coming soon!')}
              >
                <IconGithub className='size-4' /> Continue with GitHub
              </Button>

              <div className='relative py-1'>
                <Separator />
                <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground'>
                  or
                </span>
              </div>

              <Button
                variant='secondary'
                className='w-full'
                onClick={() => setEmailStep(true)}
              >
                Continue with Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailContinue} className='space-y-3 pt-2'>
              <Input
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <p className='text-xs text-muted-foreground'>
                We'll send a verification code to this email.
              </p>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  className='flex-1'
                  onClick={() => setEmailStep(false)}
                >
                  Back
                </Button>
                <Button type='submit' className='flex-1'>
                  Continue
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

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
                    <p className='text-xs text-muted-foreground capitalize'>Role: {user.role}</p>
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
              <Button
                size='sm'
                className='h-8 rounded-lg text-xs'
                onClick={() => setSignInOpen(true)}
              >
                {t('sign')}
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className='border-b' />

      <main className='mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 md:px-6'>

        {/* Courses */}
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
            {COURSES.map((course) => (
              <Link
                key={course.id}
                to='/course/$id'
                params={{ id: course.id }}
                className='group block'
              >
                <Card className='cursor-pointer gap-0 overflow-hidden p-3 transition-all duration-200 bg-neutral-800/40 hover:shadow-md hover:-translate-y-0.5'>
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
                        <Clock3 className='size-3' /> {course.hours}h
                      </span>
                      <span className='flex items-center gap-1'>
                        <Users className='size-3' /> {course.students.toLocaleString()}
                      </span>
                    </div>

                    <div className='flex items-center justify-between border-t pt-3'>
                      <span className='text-sm font-semibold'>{course.price}</span>
                      <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <Star className='size-3 fill-amber-400 text-amber-400' />
                        {course.rating}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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

          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
            {PROJECTS.map((project) => (
              <Link
                key={project.id}
                to='/project/$id'
                params={{ id: project.id }}
                className='group block'
              >
                <Card className='relative gap-3 overflow-hidden border p-0 backdrop-blur transition-all duration-300 bg-neutral-800/40 hover:shadow-md hover:-translate-y-0.5'>
                  <div className='relative overflow-hidden'>
                    <img
                      src={project.image}
                      alt={project.title}
                      className='h-44 w-full object-cover transition duration-500 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
                    <span className='absolute right-3 top-3 rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur'>
                      {project.type}
                    </span>
                  </div>
                  <p className='px-4 py-0 text-sm font-semibold text-white'>{project.title}</p>

                  <CardContent className='space-y-2 p-4 pt-0'>
                    <div className='flex flex-wrap gap-2'>
                      {project.tech.map((item) => (
                        <Badge key={item} variant='secondary' className='rounded-md px-2 py-0.5 text-[11px]'>
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
                      onClick={(e) => e.stopPropagation()}
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
