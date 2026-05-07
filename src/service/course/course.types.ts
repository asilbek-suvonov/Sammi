// ─── Enums ────────────────────────────────────────────────────────────────────

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

// ─── GET Response Types ───────────────────────────────────────────────────────

/** GET /course/list — paginated list item */
export interface Course {
  id: number
  title: string
  description: string
  image_url: string | null
  preview_video_url_full: string | null
  category_name: string
  technologies_list: string[]
  level: CourseLevel
  price: string           // decimal string: "99.00"
  /** These may be absent in GET responses — present only in admin/write context */
  is_free?: boolean
  is_new?: boolean
  is_published?: boolean
}

/** GET /course/detail/:id — adds aggregate counts */
export interface CourseDetail extends Course {
  rating: number
  reviews_count: number
  lessons_count: number
  modules_count: number
}

// ─── POST / PUT / PATCH Request Types ────────────────────────────────────────

/** POST /course/ — requires multipart/form-data (category & technologies are FKs) */
export interface CourseRequest {
  title: string
  description: string
  /** File upload: binary */
  image?: File | null
  preview_video?: File | null
  /** FK integer — Category.id */
  category?: number | null
  technologies?: number[]
  level?: CourseLevel
  /** decimal string: "99.00" */
  price?: string
  is_free?: boolean
  is_new?: boolean
  is_published?: boolean
}

// ─── Paginated List Response ──────────────────────────────────────────────────

export interface CourseListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Course[]
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface CourseQueryParams {
  page?: number
  search?: string
  ordering?: string
  level?: CourseLevel
  category?: number
  is_free?: boolean
}
  