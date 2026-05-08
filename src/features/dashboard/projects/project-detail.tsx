import { Link } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useProject } from '@/api-hooks/projects/use-projects'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { DashboardBreadcrumb } from '@/components/layout/dashboard-breadcrumb'
import { ProjectInfoSection } from '@/components/project/project-info-section'
import { ProjectMetrics } from '@/components/project/project-metrics'

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
            <p className='line-clamp-2 max-w-2xl text-sm text-muted-foreground'>{project.description}</p>
          </div>
        </div>
        <div className='flex shrink-0 gap-2'>
          {project.github_url && (
            <Button variant='outline' size='sm' asChild>
              <a href={project.github_url} target='_blank' rel='noreferrer'>
                <ExternalLink className='mr-2 size-4' />GitHub
              </a>
            </Button>
          )}
          {project.demo_url && (
            <Button size='sm' asChild>
              <a href={project.demo_url} target='_blank' rel='noreferrer'>
                <ExternalLink className='mr-2 size-4' />Demo
              </a>
            </Button>
          )}
        </div>
      </div>

      <Separator className='my-6' />

      <ProjectMetrics
        totalSteps={project.total_steps}
        totalDurationStr={project.total_duration_str}
        createdAt={project.created_at}
      />

      <div className='mt-6'>
        <ProjectInfoSection technologies={project.technologies} features={project.features} />
      </div>

    </Main>
  )
}
