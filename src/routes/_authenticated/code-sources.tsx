/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/code-sources')({
  component: CodeSourcesPage,
})

function CodeSourcesPage() {
  return (
    <Main>
      <Card>
        <CardHeader>
          <CardTitle>Code Sources</CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground'>
          Code sources page content will be connected soon.
        </CardContent>
      </Card>
    </Main>
  )
}
