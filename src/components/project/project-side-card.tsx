import { ContactDialog } from '@/components/contact-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Project } from '@/data/mock-data'
import { ExternalLink, FolderGit2, MessageCircle } from 'lucide-react'

export function ProjectSideCard({ project }: { project: Project }) {
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
            Project Price
          </p>
          <p className='mt-1 text-4xl font-black'>{project.price}</p>
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
            { label: 'Type', value: project.type },
            { label: 'Modules', value: project.modules },
            { label: 'Duration', value: project.duration },
            { label: 'Students', value: project.students.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className='flex items-center justify-between'>
              <span className='text-muted-foreground'>{label}</span>
              <span className='font-medium'>{value}</span>
            </div>
          ))}
          <div className='flex items-start justify-between gap-4'>
            <span className='text-muted-foreground'>Tech</span>
            <div className='flex flex-wrap justify-end gap-1'>
              {project.tech.map((t) => (
                <Badge key={t} variant='secondary' className='text-[11px]'>
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
