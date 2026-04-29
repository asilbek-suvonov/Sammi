import { z } from 'zod'
import { type Project } from '@/data/mock-data'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', '']),
  github_url: z.string(),
  demo_url: z.string(),
  technologies: z.array(z.string()),
  is_published: z.boolean(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export const projectDefaultValues: ProjectFormValues = {
  title: '',
  description: '',
  image: '',
  difficulty: '',
  github_url: '',
  demo_url: '',
  technologies: [],
  is_published: false,
}

export function projectToFormValues(project: Project): ProjectFormValues {
  return {
    title: project.title,
    description: project.description,
    image: project.image,
    difficulty: project.difficulty ?? '',
    github_url: project.github_url ?? '',
    demo_url: project.demo_url ?? '',
    technologies: project.tech ?? [],
    is_published: project.is_published ?? false,
  }
}
