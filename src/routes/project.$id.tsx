/* eslint-disable react-refresh/only-export-components */
import { ProjectDetailPage } from '@/features/project-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project/$id')({
  component: function ProjectDetail() {
    const { id } = Route.useParams()
    return <ProjectDetailPage id={id} />
  },
})
