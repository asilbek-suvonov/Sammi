import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/theme-provider'
import { PROJECTS } from '@/data/mock-data'
import {
  Check,
  Clock3,
  FolderGit2,
  Layers3,
  MessageCircle,
  Monitor,
  Moon,
  Sun,
  Users,
  Zap,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/project/$id')({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { id } = Route.useParams()
  const { auth } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const user = auth.user

  const project = PROJECTS.find((p) => p.id === id)

  if (!project) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground'>Project not found.</p>
      </div>
    )
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
          <span className='text-foreground'>{project.title}</span>
        </nav>

        <div className='grid gap-10 lg:grid-cols-[1fr_340px]'>
          {/* Left side */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='outline'>{project.type}</Badge>
                {project.tech.map((t) => (
                  <Badge key={t} variant='secondary'>
                    {t}
                  </Badge>
                ))}
              </div>

              <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
                {project.title}
              </h1>

              <p className='text-base leading-relaxed text-muted-foreground'>
                {project.description}
              </p>

              <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                  <Users className='size-4' />
                  {project.students.toLocaleString()} students
                </span>
                <span className='flex items-center gap-1.5'>
                  <Layers3 className='size-4' />
                  {project.modules} modules
                </span>
                <span className='flex items-center gap-1.5'>
                  <Clock3 className='size-4' />
                  {project.duration}
                </span>
              </div>
            </div>

            {/* Project image */}
            <div className='overflow-hidden rounded-xl border'>
              <img
                src={project.image}
                alt={project.title}
                className='h-64 w-full object-cover md:h-80'
              />
            </div>

            {/* What you'll build */}
            <div className='space-y-3'>
              <h2 className='text-xl font-semibold'>What You'll Build</h2>
              <ul className='space-y-2'>
                {project.features.map((feature) => (
                  <li key={feature} className='flex items-center gap-3 text-sm text-muted-foreground'>
                    <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10'>
                      <Check className='size-3 text-primary' />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div className='space-y-3'>
              <h2 className='text-xl font-semibold'>Tech Stack</h2>
              <div className='flex flex-wrap gap-2'>
                {project.tech.map((t) => (
                  <div
                    key={t}
                    className='flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium'
                  >
                    <FolderGit2 className='size-4 text-muted-foreground' />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side – sticky card */}
          <div className='lg:sticky lg:top-20 lg:self-start'>
            <div className='space-y-6 rounded-xl border bg-card p-6 shadow-sm'>
              <div>
                <p className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
                  Project Price
                </p>
                <p className='mt-1 text-4xl font-black'>{project.price}</p>
              </div>

              <div className='space-y-3'>
                <Button className='w-full gap-2' size='lg'>
                  <FolderGit2 className='size-5' /> Get Project
                </Button>
                <Button variant='outline' className='w-full gap-2' size='lg'>
                  <MessageCircle className='size-5' /> Contact
                </Button>
              </div>

              <div className='space-y-3 border-t pt-4 text-sm'>
                {[
                  { label: 'Type', value: project.type },
                  { label: 'Modules', value: project.modules },
                  { label: 'Duration', value: project.duration },
                  { label: 'Students', value: project.students.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>{label}</span>
                    <span className='font-medium'>{value}</span>
                  </div>
                ))}
                <div className='flex items-start justify-between gap-4'>
                  <span className='text-muted-foreground'>Tech</span>
                  <div className='flex flex-wrap justify-end gap-1'>
                    {project.tech.map((t) => (
                      <Badge key={t} variant='secondary' className='text-[11px]'>
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
