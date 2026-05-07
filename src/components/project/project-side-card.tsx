import { ContactDialog } from '@/components/contact-dialog'
import { Button } from '@/components/ui/button'
import type { ProjectDetail } from '@/service/projects/projects.type'

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
              Get Project
            </Button>
          ) : (
            <ContactDialog
              subject={project.title}
              title='Get this project'
              description='Leave your details and we will send you access instructions.'
              trigger={
                <Button type='button' className='w-full gap-2' size='lg'>
                   Get Project
                </Button>
              }
            />
          )}
          <ContactDialog
            subject={project.title}
            trigger={
              <Button type='button' variant='outline' className='w-full gap-2' size='lg'>
                Contact
              </Button>
            }
          />
        </div>

     
      </div>
    </div>
  )
}
