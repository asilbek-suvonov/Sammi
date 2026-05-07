import { Clock3, Layers3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectMetricsProps {
  totalSteps: number
  totalDurationStr: string
  createdAt: string
}

export function ProjectMetrics({
  totalSteps,
  totalDurationStr,
  createdAt,
}: ProjectMetricsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2'>
            <Layers3 className='size-4 text-muted-foreground' />
            <span className='text-2xl font-semibold'>{totalSteps}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2'>
            <Clock3 className='size-4 text-muted-foreground' />
            <span className='text-2xl font-semibold'>{totalDurationStr}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>Created</CardTitle>
        </CardHeader>
        <CardContent>
          <span className='text-sm font-medium'>
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
