import type { ProjectFeature } from '@/service/projects/projects.type'
import type { Technology } from '@/service/technology/technology.types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectInfoSectionProps {
  technologies: Technology[]
  features: ProjectFeature[]
}

export function ProjectInfoSection({ technologies, features }: ProjectInfoSectionProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          {technologies.length ? (
            <div className='flex flex-wrap gap-2'>
              {technologies.map((t) => (
                <Badge key={t.id} variant='outline'>{t.label}</Badge>
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No technologies listed.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Features</CardTitle>
        </CardHeader>
        <CardContent>
          {features.length ? (
            <ul className='space-y-2 text-sm'>
              {[...features].sort((a, b) => a.order - b.order).map((f) => (
                <li key={f.id} className='flex items-start gap-2'>
                  <span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-primary' />
                  {f.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-muted-foreground'>No features listed.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
