import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Project } from '@/data/mock-data'
import { Link } from '@tanstack/react-router'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to='/project/$id' params={{ id: project.id }} className='group block'>

      <Card className='cursor-pointer overflow-hidden border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/10 hover:shadow-lg'>
        
        <div className='relative overflow-hidden rounded-lg'>
          <img
            src={project.image}
            alt={project.title}
            className='h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0' />
          
          <div className='absolute right-2.5 top-2.5'>
            <Badge 
              variant='secondary' 
              className='border-transparent bg-background/80 text-foreground backdrop-blur-md'
            >
              {project.type}
            </Badge>
          </div>
        </div>

        <div className='px-1 pt-4 pb-2'>
          <p className='text-[14px] font-medium leading-snug text-card-foreground'>
            {project.title}
          </p>
        </div>

        <CardContent className='px-1 pb-2 pt-0'>
          <div className='flex flex-wrap gap-1.5'>
            {project.tech.map((item) => (
              <Badge 
                key={item} 
                variant='secondary' 
                className='rounded-md px-2 py-0.5 text-[10px]'
              >
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}