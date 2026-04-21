/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAdmin } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/dashboard/users')({
  beforeLoad: () => {
    requireAdmin()
  },
  component: UsersPage,
})

function UsersPage() {
  return (
    <Main>
      <Card>
        <CardHeader>
          <CardTitle>Users (Admin only)</CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground'>
          Users management content placeholder.
        </CardContent>
      </Card>
    </Main>
  )
}
