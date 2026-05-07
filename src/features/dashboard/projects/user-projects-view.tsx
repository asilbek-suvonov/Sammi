import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Clock, Layers3, SearchIcon } from 'lucide-react'
import { useProjects } from '@/api-hooks/projects/use-projects'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const difficultyVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  beginner: 'secondary',
  intermediate: 'default',
  advanced: 'destructive',
}

const UserProjectsView = () => {
  const [query, setQuery] = useState('')
  const { data, isLoading } = useProjects({ search: query || undefined })
  const projects = useMemo(() => data?.results ?? [], [data])

  return (
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

      {isLoading ? (
        <div className='py-12 text-center text-sm text-muted-foreground'>Yuklanmoqda...</div>
      ) : projects.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <SearchIcon className='mb-3 size-10 text-muted-foreground/50' />
          <p className='text-sm font-medium'>No projects found</p>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
            <div
              key={project.id}
              className='group overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md p-4'
            >
              <Link to='/project/$id' params={{ id: String(project.id) }}>
                <div className='relative h-45 overflow-hidden rounded-md'>
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute left-2 top-2 flex gap-1'>
                    <Badge
                      variant={difficultyVariant[project.difficulty] ?? 'secondary'}
                      className='text-[10px] capitalize'
                    >
                      {project.difficulty_display || project.difficulty}
                    </Badge>
                  </div>
                </div>
              </Link>
              <div className='p-3'>
                <Link
                  to='/project/$id'
                  params={{ id: String(project.id) }}
                  className='block text-sm font-medium leading-snug hover:underline'
                >
                  {project.title}
                </Link>
                <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>
                  {project.description}
                </p>
                <div className='mt-2 flex flex-wrap gap-1'>
                  {project.technologies.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className='rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground'
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                <div className='mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <Layers3 className='size-3' /> {project.total_steps} steps
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock className='size-3' /> {project.total_duration_str}
                  </span>
                </div>
                <div className='mt-3'>
                  <Link to='/project/$id' params={{ id: String(project.id) }}>
                    <Button size='sm' className='w-full text-xs'>
                      View Project
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

export default UserProjectsView
