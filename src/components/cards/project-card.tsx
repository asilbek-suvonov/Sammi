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
      <Card className='cursor-pointer overflow-hidden border p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 dark:bg-neutral-900/30'>
        <div className='relative overflow-hidden rounded-lg'>
          <img
            src={project.image_url ?? undefined}
            alt={project.title}
            className='h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0' />

          <div className='absolute top-2.5 right-2.5'>
            <Badge
              variant='secondary'
              className='border-transparent bg-background/80 text-[10px] text-foreground backdrop-blur-md'
            >
              {project.difficulty_display || project.difficulty}
            </Badge>
          </div>
        </div>

        <div className='px-1 pt-4 pb-2'>
          <p className='text-[14px] leading-snug font-medium text-foreground'>
            {project.title}
          </p>
        </div>

        <CardContent className='px-1 pt-0 pb-2'>
          <div className='flex flex-wrap gap-1.5'>
            {project.technologies.flatMap((tech) =>
              tech.value.map((item, index) => (
                <Badge
                  key={`${tech.id}-${item}-${index}`}
                  variant='secondary'
                  className='rounded-md border-none bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                >
                  {item}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
