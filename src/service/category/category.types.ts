import type { Course } from '@/service/course/course.types'

// ─── GET Response Types ───────────────────────────────────────────────────────

/** GET /category/list — paginated list item */
export interface Category {
  id: number
  name: string
  slug: string
}

/** GET /category/detail/:id — with courses */
export interface CategoryDetail {
  id: number
  name: string
  slug: string
  courses_count: number
  courses: Course[]
}

/** Paginated list response */
export interface CategoryListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Category[]
}

// ─── POST / PUT / PATCH Request Types ────────────────────────────────────────

export interface CategoryRequest {
  name: string
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface CategoryQueryParams {
  page?: number
  search?: string
  ordering?: string
}
