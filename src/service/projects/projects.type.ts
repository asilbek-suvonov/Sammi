import type { Technology } from '@/service/technology/technology.types'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// --- Project Types ---
export interface ProjectListItem {
  id: number
  title: string
  slug: string
  description: string
  image_url: string | null
  difficulty: Difficulty
  difficulty_display: string
  github_url: string
  demo_url: string
  technologies: Technology[]
  created_at: string
  total_steps: number
  total_duration_str: string
  is_published?: boolean
}

// --- Step Types ---
export interface ProjectStep {
  id: number
  project: number
  title: string
  video_url: string | null
  duration: number
  order: number
}

// --- Request Types ---
export interface ProjectRequest {
  title: string
  description: string
  image?: File | null
  difficulty: Difficulty
  github_url?: string
  demo_url?: string
  technologies?: number[]
  is_published?: boolean
}

export type ProjectPatchRequest = Partial<ProjectRequest>

export interface StepRequest {
  title: string
  duration?: number
  order: number
  video?: File | null
}

export type StepPatchRequest = Partial<StepRequest>

export interface StepReorderItem {
  id: number
  order: number
}

export interface StepReorderRequest {
  project: number
  steps: StepReorderItem[]
}

export interface ProjectFilters {
  difficulty?: Difficulty
  is_published?: boolean
  ordering?: string
  page?: number
  search?: string
  technologies?: number | number[]
}