import { useState } from 'react'
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
import { Clock, Layers3, SearchIcon, Users } from 'lucide-react'

const difficultyVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  Easy: 'default',
  Medium: 'secondary',
  Hard: 'destructive',
}

const UserProjectsView = () => {
  const { projects } = useAdminStore()
  const [query, setQuery] = useState('')

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  )

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
            <h1 className='text-2xl font-bold tracking-tight'>Projects</h1>
            <p className='text-sm text-muted-foreground'>
              Browse projects and build your portfolio.
            </p>
          </div>
        </div>

        <Separator className='my-4' />

        <div className='mb-4 relative w-full sm:w-72'>
          <SearchIcon className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search projects...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='pl-9'
          />
        </div>

        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
            <SearchIcon className='mb-3 size-10 text-muted-foreground/50' />
            <p className='text-sm font-medium'>No projects found</p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filtered.map((project) => (
              <div
                key={project.id}
                className='group overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md'
              >
                <Link to='/project/$id' params={{ id: project.id }}>
                  <div className='relative h-36 overflow-hidden'>
                    <img
                      src={project.image}
                      alt={project.title}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                    <div className='absolute left-2 top-2 flex gap-1'>
                      <Badge variant='secondary' className='text-[10px]'>
                        {project.type}
                      </Badge>
                      {project.difficulty && (
                        <Badge
                          variant={difficultyVariant[project.difficulty] ?? 'secondary'}
                          className='text-[10px]'
                        >
                          {project.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
                <div className='p-3'>
                  <Link
                    to='/project/$id'
                    params={{ id: project.id }}
                    className='block text-sm font-medium leading-snug hover:underline'
                  >
                    {project.title}
                  </Link>
                  <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>
                    {project.description}
                  </p>
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {project.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className='rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground'
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className='mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Layers3 className='size-3' /> {project.modules} modules
                    </span>
                    <span className='flex items-center gap-1'>
                      <Clock className='size-3' /> {project.duration}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Users className='size-3' /> {project.students.toLocaleString()}
                    </span>
                  </div>
                  <div className='mt-3'>
                    <Link to='/project/$id' params={{ id: project.id }}>
                      <Button size='sm' className='w-full text-xs'>
                        View Project — {project.price}
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

export default UserProjectsView
