import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Layers3, Users } from 'lucide-react'
import { useProjects } from '@/stores/selectors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { DashboardBreadcrumb } from '@/components/layout/dashboard-breadcrumb'

interface AdminProjectDetailProps {
  id: string
}

export function AdminProjectDetail({ id }: AdminProjectDetailProps) {
  const projects = useProjects()
  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id])

  if (!project) {
    return (
      <>
        <Main>
          <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
            <h1 className='text-2xl font-semibold'>Project not found</h1>
            <p className='text-sm text-muted-foreground'>
              The project you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link to='/dashboard/projects'>
                <ArrowLeft className='mr-2 size-4' />
                Back to projects
              </Link>
            </Button>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Main>
        <DashboardBreadcrumb
          className='mb-4'
          items={[
            { label: 'Dashboard', to: '/dashboard/overview' },
            { label: 'Projects', to: '/dashboard/projects' },
            { label: project.title },
          ]}
        />

        <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
          <div className='flex min-w-0 items-start gap-4'>
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className='h-20 w-32 shrink-0 rounded-md border object-cover'
              />
            )}
            <div className='min-w-0 space-y-2'>
              <div className='flex flex-wrap items-center gap-2'>
                {project.difficulty && (
                  <Badge variant='outline'>{project.difficulty}</Badge>
                )}
                <Badge variant='secondary'>{project.type}</Badge>
                {project.is_published ? (
                  <Badge className='bg-green-600 text-white hover:bg-green-700'>Published</Badge>
                ) : (
                  <Badge variant='outline'>Draft</Badge>
                )}
              </div>
              <h1 className='truncate text-2xl font-bold tracking-tight'>{project.title}</h1>
              <p className='line-clamp-2 max-w-2xl text-sm text-muted-foreground'>
                {project.description}
              </p>
            </div>
          </div>
          <div className='flex shrink-0 gap-2'>
            {project.github_url && (
              <Button variant='outline' size='sm' asChild>
                <a href={project.github_url} target='_blank' rel='noreferrer'>
                  <ExternalLink className='mr-2 size-4' />
                  GitHub
                </a>
              </Button>
            )}
            {project.demo_url && (
              <Button size='sm' asChild>
                <a href={project.demo_url} target='_blank' rel='noreferrer'>
                  <ExternalLink className='mr-2 size-4' />
                  Demo
                </a>
              </Button>
            )}
          </div>
        </div>

        <Separator className='my-6' />

        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Layers3 className='size-4 text-muted-foreground' />
                <span className='text-2xl font-semibold'>{project.modules}</span>
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>{project.duration} total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Users className='size-4 text-muted-foreground' />
                <span className='text-2xl font-semibold'>
                  {project.students.toLocaleString()}
                </span>
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className='text-2xl font-semibold'>{project.price}</span>
            </CardContent>
          </Card>
        </div>

        <div className='mt-6 grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              {project.tech.length ? (
                <div className='flex flex-wrap gap-2'>
                  {project.tech.map((t) => (
                    <Badge key={t} variant='outline'>
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>No technologies listed.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Features</CardTitle>
            </CardHeader>
            <CardContent>
              {project.features.length ? (
                <ul className='space-y-2 text-sm'>
                  {project.features.map((f) => (
                    <li key={f} className='flex items-start gap-2'>
                      <span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-primary' />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-muted-foreground'>No features listed.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
