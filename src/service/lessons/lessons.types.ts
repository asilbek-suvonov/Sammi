// ─── GET Response Types ───────────────────────────────────────────────────────

/** GET /lessons/list — paginated list item */
export interface Lesson {
  id: number
  module: number
  module_title?: string
  course_title?: string
  title: string
  video_url: string
  duration: number
  duration_formatted?: string
  order: number
  is_preview: boolean
}

/** Paginated list response */
export interface LessonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Lesson[]
}

// ─── POST / PUT / PATCH Request Types ────────────────────────────────────────

/** POST /lessons/ and PUT/PATCH /lessons/:id/ */
export interface LessonRequest {
  module: number
  title: string
  video_url: string
  duration: number
  order?: number
  is_preview?: boolean
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface LessonQueryParams {
  page?: number
  module?: number
  search?: string
  ordering?: string
}
