import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Project } from '@/data/mock-data'
import { Link } from '@tanstack/react-router'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to='/project/$id' params={{ id: project.id }} className='group block'>
      {/* CourseCard bilan bir xil Card uslubi */}
      <Card className='cursor-pointer overflow-hidden border border-neutral-700/50 bg-neutral-900/30 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-2xl hover:shadow-black/20'>
        
        {/* Rasm qismi (CourseCard'dagi kabi rounded-lg va zoom effekt) */}
        <div className='relative overflow-hidden rounded-lg'>
          <img
            src={project.image}
            alt={project.title}
            className='h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
          />
          {/* Projectga xos gradient */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
          
          {/* Type Badge */}
          <span className='absolute right-2.5 top-2.5 rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur'>
            {project.type}
          </span>
        </div>

        {/* Title */}
        <div className='px-1 pt-4 pb-2'>
          <p className='text-[14px] font-medium leading-snug text-white'>
            {project.title}
          </p>
        </div>

        {/* Tech Tags */}
        
        <CardContent className='px-1 pb-2 pt-0'>
          <div className='flex flex-wrap gap-1.5'>
            {project.tech.map((item) => (
              <Badge 
                key={item} 
                variant='secondary' 
                className='rounded-md px-2 py-0.5 text-[10px] bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
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