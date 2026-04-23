/* eslint-disable react-refresh/only-export-components */
import { CoursePreviewPage } from '@/features/landing/course-preview'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({ courseId: z.string().default('0') })

export const Route = createFileRoute('/course/preview')({
  validateSearch: searchSchema,
  component: function CoursePreview() {
    const { courseId } = Route.useSearch()
    return <CoursePreviewPage courseId={courseId} />
  },
})
