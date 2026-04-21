/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/dashboard/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <Main>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground'>
          Projects content placeholder.
        </CardContent>
      </Card>
    </Main>
  )
}
