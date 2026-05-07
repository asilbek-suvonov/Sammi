import { z } from 'zod'
import type { CourseLevel } from '@/service/course/course.types'

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string(),
  category: z.string(),
  technologies: z.array(z.string()),
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
  is_published: true,   // ← admin creates published courses by default
}

const normalizeLevel = (value: string | undefined): CourseLevel => {
  const v = (value ?? '').toLowerCase()
  if (v === 'intermediate') return 'intermediate'
  if (v === 'advanced') return 'advanced'
  return 'beginner'
}

export function courseToFormValues(course: {
  title: string
  description: string
  image_url: string | null
  category_name: string
  level: CourseLevel
  price: string
}): CourseFormValues {
  return {
    title: course.title,
    description: course.description,
    image: course.image_url ?? '',
    category: '',       // category_name is a string — can't reverse-lookup ID without extra fetch
    technologies: [],
    level: normalizeLevel(course.level),
    price: course.price ?? '',
    is_free: false,
    is_new: false,
    is_published: false,
  }
}
