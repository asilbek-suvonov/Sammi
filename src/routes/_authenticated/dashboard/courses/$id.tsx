import { createFileRoute } from '@tanstack/react-router'
import { AdminCourseDetail } from '@/features/dashboard/courses/course-detail'

export const Route = createFileRoute('/_authenticated/dashboard/courses/$id')({
  component: CourseDetailRoute,
})

function CourseDetailRoute() {
  const { id } = Route.useParams()
  return <AdminCourseDetail id={id} />
}
