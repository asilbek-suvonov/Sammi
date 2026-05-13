import { useProjects, useProjectSteps } from '@/api-hooks/projects/use-projects'
import { ProjectSideCard } from '@/components/project/project-side-card'
import { PageBreadcrumb } from '@/components/public/page-breadcrumb'
import { PublicHeader } from '@/components/public/public-header'
import { PublicNavRight } from '@/components/public/public-nav-right'
import { PageLoader } from '@/components/shared/loader'
import { Badge } from '@/components/ui/badge'
import { Clock3, FolderGit2, Layers3, PlayCircle } from 'lucide-react'
import { useMemo } from 'react'

interface Props { id: string }

export function ProjectDetailPage({ id }: Props) {
  const { data: listData, isLoading: listLoading } = useProjects()
  const project = useMemo(
    () => listData?.results.find((p) => String(p.id) === String(id)),
    [listData, id],
  )

  const { data: stepsData, isLoading: stepsLoading } = useProjectSteps(id)
  const steps = stepsData?.results ?? []

  const isLoading = listLoading || stepsLoading

  if (isLoading) {
    return <PageLoader fullScreen />
  }

  if (!project) {
    return (
      <div className='flex min-h-svh items-center justify-center px-4 text-center'>
        <p className='text-muted-foreground'>Project not found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-svh bg-background text-foreground'>
      <PublicHeader logoAsLink right={<PublicNavRight />} />

      <main className='mx-auto max-w-6xl px-4 py-6 sm:py-10 md:px-6'>
        <PageBreadcrumb label={project.title} />
        <div className='grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8'>
          <div className='space-y-6 sm:space-y-8'>
            <div className='space-y-3 sm:space-y-4'>
              <div className='flex flex-wrap gap-1'>
                <Badge variant='outline' className='capitalize'>
                  {project.difficulty_display || project.difficulty}
                </Badge>
                {project.technologies.map((t) => (
                  <Badge key={t.id} variant='secondary'>{t.label}</Badge>
                ))}
              </div>
              <h1 className='text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl'>{project.title}</h1>
              <p className='text-sm leading-relaxed text-muted-foreground'>{project.description}</p>
              <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                  <Layers3 className='size-4' /> {project.total_steps} steps
                </span>
                <span className='flex items-center gap-1.5'>
                  <Clock3 className='size-4' /> {project.total_duration_str}
                </span>
              </div>
            </div>

            <div className='overflow-hidden rounded-xl border'>
              <img
                src={project.image_url ?? undefined}
                alt={project.title}
                className='aspect-video w-full object-cover'
              />
            </div>

            {steps.length > 0 && (
              <div className='space-y-3'>
                <h2 className='text-xl font-semibold'>Steps</h2>
                <ul className='space-y-2'>
                  {[...steps]
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <li
                        key={step.id}
                        className='flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm'
                      >
                        <span className='flex items-center gap-2'>
                          <PlayCircle className='size-4 text-muted-foreground' />
                          <span className='truncate'>{step.title}</span>
                        </span>
                        <span className='font-mono text-xs text-muted-foreground'>
                          {Math.round(step.duration / 60)}m
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className='space-y-3'>
              <h2 className='text-xl font-semibold'>Tech Stack</h2>
              <div className='flex flex-wrap gap-2'>
                {project.technologies.map((t) => (
                  <div
                    key={t.id}
                    className='flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium'
                  >
                    <FolderGit2 className='size-4 text-muted-foreground' /> {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ProjectSideCard project={project} />
        </div>
      </main>
    </div>
  )
}
