import { ContactDialog } from '@/components/contact-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProjectDetail } from '@/service/projects/projects.type'
import { ExternalLink, FolderGit2, MessageCircle } from 'lucide-react'

export function ProjectSideCard({ project }: { project: ProjectDetail }) {
  const hasLinks = Boolean(project.demo_url || project.github_url)

  const handleGetProject = () => {
    const url = project.demo_url || project.github_url
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className='lg:sticky lg:top-20 lg:self-start'>
      <div className='space-y-6 rounded-xl border bg-card p-6 shadow-sm'>
        <div>
          <p className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
            Difficulty
          </p>
          <p className='mt-1 text-2xl font-semibold capitalize'>
            {project.difficulty_display || project.difficulty}
          </p>
        </div>

        <div className='space-y-3'>
          {hasLinks ? (
            <Button type='button' className='w-full gap-2' size='lg' onClick={handleGetProject}>
              <ExternalLink className='size-5' /> Get Project
            </Button>
          ) : (
            <ContactDialog
              subject={project.title}
              title='Get this project'
              description='Leave your details and we will send you access instructions.'
              trigger={
                <Button type='button' className='w-full gap-2' size='lg'>
                  <FolderGit2 className='size-5' /> Get Project
                </Button>
              }
            />
          )}
          <ContactDialog
            subject={project.title}
            trigger={
              <Button type='button' variant='outline' className='w-full gap-2' size='lg'>
                <MessageCircle className='size-5' /> Contact
              </Button>
            }
          />
        </div>

        <div className='space-y-3 border-t pt-4 text-sm'>
          {[
            { label: 'Steps', value: project.total_steps },
            { label: 'Duration', value: project.total_duration_str },
          ].map(({ label, value }) => (
            <div key={label} className='flex items-center justify-between'>
              <span className='text-muted-foreground'>{label}</span>
              <span className='font-medium'>{value}</span>
            </div>
          ))}
          <div className='flex items-start justify-between gap-4'>
            <span className='text-muted-foreground'>Tech</span>
            <div className='flex flex-wrap justify-end gap-1'>
              {project.technologies.map((t) => (
                <Badge key={t.id} variant='secondary' className='text-[11px]'>
                  {t.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
