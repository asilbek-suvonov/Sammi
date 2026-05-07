import { z } from 'zod'
import type { Difficulty, ProjectListItem } from '@/service/projects/projects.type'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  github_url: z.string(),
  demo_url: z.string(),
  technologies: z.array(z.number()),
  is_published: z.boolean(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export const projectDefaultValues: ProjectFormValues = {
  title: '',
  description: '',
  image: '',
  difficulty: 'beginner',
  github_url: '',
  demo_url: '',
  technologies: [],
  is_published: true,
}

const normalizeDifficulty = (value: string | undefined): Difficulty => {
  const v = (value ?? '').toLowerCase()
  if (v === 'intermediate') return 'intermediate'
  if (v === 'advanced') return 'advanced'
  return 'beginner'
}

export function projectToFormValues(project: ProjectListItem): ProjectFormValues {
  return {
    title: project.title,
    description: project.description,
    image: project.image_url ?? '',
    difficulty: normalizeDifficulty(project.difficulty),
    github_url: project.github_url ?? '',
    demo_url: project.demo_url ?? '',
    technologies: project.technologies?.map((t) => t.id) ?? [],
    is_published: project.is_published ?? true,
  }
}
