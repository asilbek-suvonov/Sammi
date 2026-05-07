import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { ProjectListItem } from '@/service/projects/projects.type'
import { Link } from '@tanstack/react-router'

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      to='/project/$id'
      params={{ id: String(project.id) }}
      className='group block'
    >
      <Card className='cursor-pointer overflow-hidden border dark:bg-neutral-900/30 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20'>
        <div className='relative overflow-hidden rounded-lg'>
          <img
            src={project.image_url}
            alt={project.title}
            className='h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0' />

          <div className='absolute right-2.5 top-2.5'>
            <Badge
              variant='secondary'
              className='border-transparent bg-background/80 text-foreground backdrop-blur-md text-[10px]'
            >
              {project.difficulty_display || project.difficulty}
            </Badge>
          </div>
        </div>

        <div className='px-1 pt-4 pb-2'>
          <p className='text-[14px] font-medium leading-snug text-foreground'>
            {project.title}
          </p>
        </div>

        <CardContent className='px-1 pb-2 pt-0'>
          <div className='flex flex-wrap gap-1.5'>
            {project.technologies.map((tech) => (
              <Badge
                key={tech.id}
                variant='secondary'
                className='rounded-md px-2 py-0.5 text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-none'
              >
                {tech.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
