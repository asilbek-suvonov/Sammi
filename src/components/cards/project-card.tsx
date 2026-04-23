import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Project } from '@/data/mock-data'
import { Link } from '@tanstack/react-router'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to='/project/$id' params={{ id: project.id }} className='group block'>
      <Card className='relative gap-3 overflow-hidden border p-0 backdrop-blur transition-all duration-300 bg-neutral-800/40 hover:shadow-md hover:-translate-y-0.5'>
        <div className='relative overflow-hidden'>
          <img
            src={project.image}
            alt={project.title}
            className='h-44 w-full object-cover transition duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
          <span className='absolute right-3 top-3 rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur'>
            {project.type}
          </span>
        </div>

        <p className='px-4 py-0 text-sm font-semibold text-white'>{project.title}</p>

        <CardContent className='space-y-2 p-4 pt-0'>
          <div className='flex flex-wrap gap-2'>
            {project.tech.map((item) => (
              <Badge key={item} variant='secondary' className='rounded-md px-2 py-0.5 text-[11px]'>
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
