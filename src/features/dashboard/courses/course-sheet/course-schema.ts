import { z } from 'zod'
import type { Course, CourseLevel } from '@/service/course/course.types'

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image is required'),
  category: z.string(),
  technologies: z.array(z.number()),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.string().min(1, 'Price is required'),
  is_free: z.boolean(),
  is_new: z.boolean(),
  is_published: z.boolean(),
})

export type CourseFormValues = z.infer<typeof courseSchema>

export const courseDefaultValues: CourseFormValues = {
  title: '',
  description: '',
  image: '',
  category: '',
  technologies: [],
  level: 'beginner',
  price: '',
  is_free: false,
  is_new: false,
  is_published: false,
}

const normalizeLevel = (value: string | undefined): CourseLevel => {
  const v = (value ?? '').toLowerCase()
  if (v === 'intermediate') return 'intermediate'
  if (v === 'advanced') return 'advanced'
  return 'beginner'
}

export function courseToFormValues(course: Course): CourseFormValues {
  return {
    title: course.title,
    description: course.description,
    image: course.image_url ?? '',
    category: course.category_name ?? '',
    technologies: [],
    level: normalizeLevel(course.level),
    price: course.price ?? '',
    is_free: course.is_free ?? false,
    is_new: course.is_new ?? false,
    is_published: course.is_published ?? false,
  }
}
