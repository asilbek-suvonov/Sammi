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

/** GET /modules/detail/{id}/ — detail info */
export interface ModuleDetail {
  id: number
  course: number
  course_title: string
  title: string
  order: number
  lessons: string[] // Lessonlar ro'yxati (string yoki obyektligiga qarab o'zgartirish mumkin)
}

// ─── POST / PUT Request Types ───────────────────────────────────────────────

/** POST /modules/ va PUT /modules/{id}/ */
export interface ModuleRequest {
  course: number // Course ID
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