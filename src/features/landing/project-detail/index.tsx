import { useProject } from '@/api-hooks/projects/use-projects'
import { ProjectSideCard } from '@/components/project/project-side-card'
import { PageBreadcrumb } from '@/components/public/page-breadcrumb'
import { PublicHeader } from '@/components/public/public-header'
import { PublicNavRight } from '@/components/public/public-nav-right'
import { Badge } from '@/components/ui/badge'
import { Check, Clock3, FolderGit2, Layers3, PlayCircle } from 'lucide-react'

interface Props { id: string }

export function ProjectDetailPage({ id }: Props) {
  const { data: project, isLoading } = useProject(id)

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center text-sm text-muted-foreground'>
        Yuklanmoqda...
      </div>
    )
  }

  if (!project) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground'>Project not found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <PublicHeader logoAsLink right={<PublicNavRight />} />

      <main className='mx-auto max-w-6xl px-4 py-10 md:px-6'>
        <PageBreadcrumb label={project.title} />
        <div className='grid gap-10 lg:grid-cols-[1fr_340px]'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex flex-wrap gap-1'>
                <Badge variant='outline' className='capitalize'>
                  {project.difficulty_display || project.difficulty}
                </Badge>
                {project.technologies.map((t) => (
                  <Badge key={t.id} variant='secondary'>{t.label}</Badge>
                ))}
              </div>
              <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{project.title}</h1>
              <p className='text-xs leading-relaxed text-muted-foreground'>{project.description}</p>
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
                className='h-64 w-full object-cover md:h-80'
              />
            </div>

            {project.features.length > 0 && (
              <div className='space-y-3'>
                <h2 className='text-xl font-semibold'>What You&apos;ll Build</h2>
                <ul className='space-y-2'>
                  {[...project.features]
                    .sort((a, b) => a.order - b.order)
                    .map((feature) => (
                      <li
                        key={feature.id}
                        className='flex items-center gap-3 text-sm text-muted-foreground'
                      >
                        <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10'>
                          <Check className='size-3 text-primary' />
                        </span>
                        {feature.text}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {project.steps.length > 0 && (
              <div className='space-y-3'>
                <h2 className='text-xl font-semibold'>Steps</h2>
                <ul className='space-y-2'>
                  {[...project.steps]
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
