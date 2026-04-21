/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/dashboard/courses')({
  component: CoursesPage,
})

function CoursesPage() {
  return (
    <Main>
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground'>
          Courses content placeholder.
        </CardContent>
      </Card>
    </Main>
  )
}
