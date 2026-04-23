/* eslint-disable react-refresh/only-export-components */
import { CourseDetailPage } from '@/features/landing/course-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/course/$id')({
  component: function CourseDetail() {
    const { id } = Route.useParams()
    return <CourseDetailPage id={id} />
  },
})
