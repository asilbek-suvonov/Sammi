import { z } from 'zod'
import { type Course } from '@/data/mock-data'
import { TECHNOLOGIES_OPTIONS } from '@/data/tech-options'

export { TECHNOLOGIES_OPTIONS }

export const CATEGORY_OPTIONS = [
  'Frontend',
  'Backend',
  'Full-Stack',
  'Mobile',
  'DevOps',
  'Data Science',
  'UI/UX Design',
  'API',
  'Database',
  'Cloud',
  'Language',
  'Design',
].map((category) => ({ label: category, value: category }))

const CATEGORY_ALIASES: Record<string, string> = {
  fullstack: 'Full-Stack',
  'full-stack': 'Full-Stack',
  'full stack': 'Full-Stack',
  uiux: 'UI/UX Design',
  'ui-ux': 'UI/UX Design',
  'ui/ux': 'UI/UX Design',
  'ui/ux design': 'UI/UX Design',
}

export function normalizeCategory(category?: string) {
  if (!category) return ''

  const normalized = category.trim().toLowerCase()
  const option = CATEGORY_OPTIONS.find(
    (item) => item.value.toLowerCase() === normalized
  )

  return option?.value ?? CATEGORY_ALIASES[normalized] ?? category
}

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image is required'),
  category: z.string(),
  technologies: z.array(z.string()),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
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
  level: 'Beginner',
  price: '',
  is_free: false,
  is_new: false,
  is_published: false,
}

export function courseToFormValues(course: Course): CourseFormValues {
  return {
    title: course.title,
    description: course.description,
    image: course.image,
    category: normalizeCategory(course.category),
    technologies: course.technologies ?? [],
    level: course.level,
    price: course.price,
    is_free: course.is_free ?? false,
    is_new: course.is_new ?? false,
    is_published: course.is_published ?? false,
  }
}
