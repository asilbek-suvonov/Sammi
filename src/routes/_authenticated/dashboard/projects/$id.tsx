import { createFileRoute } from '@tanstack/react-router'
import { AdminProjectDetail } from '@/features/dashboard/admin/projects/project-detail'

export const Route = createFileRoute('/_authenticated/dashboard/projects/$id')({
  component: ProjectDetailRoute,
})

function ProjectDetailRoute() {
  const { id } = Route.useParams()
  return <AdminProjectDetail id={id} />
}
