import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

const userProjects = [
  {
    id: 1,
    title: 'SaaS Billing Dashboard',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=800&auto=format&fit=crop',
    tech: ['React', 'TanStack Router', 'Tailwind'],
    type: 'Full-Stack',
    status: 'Bajarilmoqda',
  },
  {
    id: 2,
    title: 'Analytics Portal',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    tech: ['Recharts', 'React Query'],
    type: 'Data',
    status: 'Tugallangan',
  },
]

export function UserProjects() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Mening loyihalarim</h2>
          <p className='text-muted-foreground'>Sizga tayinlangan loyihalar.</p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          {userProjects.map((project) => (
            <Card key={project.id} className='group overflow-hidden gap-0 p-0'>
              <div className='relative overflow-hidden'>
                <img
                  src={project.image}
                  alt={project.title}
                  className='h-36 w-full object-cover transition duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
                <span className='absolute right-3 top-3 rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[11px] text-white backdrop-blur'>
                  {project.type}
                </span>
              </div>
              <CardHeader className='px-4 pt-4 pb-2'>
                <div className='flex items-center justify-between gap-2'>
                  <CardTitle className='text-sm font-medium'>{project.title}</CardTitle>
                  <Badge
                    variant={project.status === 'Tugallangan' ? 'default' : 'secondary'}
                    className='shrink-0 text-[10px]'
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='flex items-center justify-between px-4 pb-4'>
                <div className='flex flex-wrap gap-1'>
                  {project.tech.map((t) => (
                    <Badge key={t} variant='outline' className='text-[10px]'>{t}</Badge>
                  ))}
                </div>
                <Button variant='ghost' size='icon' className='size-7 shrink-0'>
                  <ExternalLink className='size-3.5' />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}
