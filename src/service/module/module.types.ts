import type { Lesson } from '@/service/lessons/lessons.types'

// ─── GET Response Types ───────────────────────────────────────────────────────

/** GET /modules/list — paginated list item */
export interface ModuleListItem {
  id: number
  course: number
  course_title: string
  title: string
  order: number
  lessons_count: number
  total_duration: number
}

/** GET /modules/detail/:id/ — includes full lesson list */
export interface ModuleDetail {
  id: number
  course: number
  course_title: string
  title: string
  order: number
  lessons?: Lesson[]
}

// ─── POST / PUT / PATCH Request Types ────────────────────────────────────────

/** POST /modules/ and PUT/PATCH /modules/:id/ */
export interface ModuleRequest {
  course: number
  title: string
  order?: number
}

// ─── Paginated List Response ──────────────────────────────────────────────────

export interface ModuleListResponse {
  count: number
  next: string | null
  previous: string | null
  results: ModuleListItem[]
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ModuleQueryParams {
  page?: number
  search?: string
  ordering?: string
}
