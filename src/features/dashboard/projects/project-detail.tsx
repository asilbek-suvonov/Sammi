import { Link } from '@tanstack/react-router'
import { ArrowLeft, Clock3, ExternalLink, Layers3, PlayCircle } from 'lucide-react'
import { useProject } from '@/api-hooks/projects/use-projects'
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
  const { data: project, isLoading } = useProject(id)

  if (isLoading) {
    return (
      <Main>
        <div className='py-12 text-center text-sm text-muted-foreground'>Yuklanmoqda...</div>
      </Main>
    )
  }

  if (!project) {
    return (
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
    )
  }

  return (
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
          {project.image_url && (
            <img
              src={project.image_url}
              alt={project.title}
              className='h-20 w-32 shrink-0 rounded-md border object-cover'
            />
          )}
          <div className='min-w-0 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline' className='capitalize'>
                {project.difficulty_display || project.difficulty}
              </Badge>
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
              Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Layers3 className='size-4 text-muted-foreground' />
              <span className='text-2xl font-semibold'>{project.total_steps}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Clock3 className='size-4 text-muted-foreground' />
              <span className='text-2xl font-semibold'>{project.total_duration_str}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className='text-sm font-medium'>
              {new Date(project.created_at).toLocaleDateString()}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            {project.technologies.length ? (
              <div className='flex flex-wrap gap-2'>
                {project.technologies.map((t) => (
                  <Badge key={t.id} variant='outline'>
                    {t.name}
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
                {[...project.features]
                  .sort((a, b) => a.order - b.order)
                  .map((f) => (
                    <li key={f.id} className='flex items-start gap-2'>
                      <span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-primary' />
                      {f.text}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className='text-sm text-muted-foreground'>No features listed.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {project.steps.length > 0 && (
        <div className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2 text-sm'>
                {[...project.steps]
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                    <li
                      key={step.id}
                      className='flex items-center justify-between rounded-lg border bg-card px-3 py-2'
                    >
                      <span className='flex items-center gap-2'>
                        <PlayCircle className='size-4 text-muted-foreground' />
                        {step.title}
                      </span>
                      <span className='font-mono text-xs text-muted-foreground'>
                        {Math.round(step.duration / 60)}m
                      </span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </Main>
  )
}
