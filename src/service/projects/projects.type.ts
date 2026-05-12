import type { Technology } from '@/service/technology/technology.types'

// ─── Enums (API DifficultyEnum) ───────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface ProjectFeature {
  id: number
  text: string
  order: number
}

/** GET /projects/steps/:id */
export interface ProjectStep {
  id: number
  project: number
  title: string
  description?: string
  video_url: string | null
  duration: number        // sekundlarda
  order: number
}

/** PATCH /projects/steps/:id — partial update */
export type StepPatchRequest = Partial<Omit<StepRequest, 'project'>>

/** POST /projects/steps/reorder — bulk reorder payload */
export interface StepReorderItem {
  id: number
  order: number
}

export interface StepReorderRequest {
  project: number
  steps: StepReorderItem[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ─── GET Response Types ───────────────────────────────────────────────────────

/** GET /projects — list item */
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
  /** API da Technology serializer qaytaradi */
  technologies: Technology[]
  created_at: string      // ISO date string
  total_steps: number
  total_duration_str: string
  /** Admin create/update endpoints return this; public GET may omit it */
  is_published?: boolean
}

/** GET /projects/:id — full detail */
export interface ProjectDetail extends ProjectListItem {
  features: ProjectFeature[]
  steps: ProjectStep[]
}

// ─── POST / PUT / PATCH Request Types ────────────────────────────────────────

/** POST /projects/admin/create */
export interface ProjectRequest {
  title: string
  description: string
  /** File upload. null = olib tashlash */
  image?: File | null
  difficulty: Difficulty
  github_url?: string
  demo_url?: string
  /** Technology ID lari massivi */
  technologies?: number[]
  is_published?: boolean
}

/** PATCH /projects/admin/:id/update — barcha maydonlar optional */
export type ProjectPatchRequest = Partial<ProjectRequest>

/** POST /projects/steps/create */
export interface StepRequest {
  project: number
  title: string
  description?: string
  video?: File | null
  duration?: number
  order?: number
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ProjectFilters {
  difficulty?: Difficulty
  ordering?: 'created_at' | '-created_at' | 'title' | '-title'
  page?: number
  page_size?: number
  search?: string
  technologies?: number | number[]
}
