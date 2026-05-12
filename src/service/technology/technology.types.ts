// ─── Enums ────────────────────────────────────────────────────────────────────

/** API CategoryEnum — technology.category field qiymatlari */
export type TechnologyCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'mobile'
  | 'other'

// ─── GET Response Types ───────────────────────────────────────────────────────

/** TechnologySerializers — list va project ichida ishlatiladi */
export interface Technology {
  id: number
  category: TechnologyCategory
  category_display: string
  label: string
  value: string[]
  description: string | null
}

/** GET /technology/list — paginated */
export interface TechnologyListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Technology[]
}

/** GET /technology/grouped — category bo'yicha guruhlangan */
export interface TechnologyGrouped {
  category: TechnologyCategory
  category_display: string
  technologies: Technology[]
}

// ─── POST / PUT / PATCH Request Types ────────────────────────────────────────

export interface TechnologyRequest {
  value: string[]
  label?: string
  category?: TechnologyCategory
  description?: string | null
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface TechnologyQueryParams {
  page?: number
  search?: string
  ordering?: string
  category?: TechnologyCategory
}
