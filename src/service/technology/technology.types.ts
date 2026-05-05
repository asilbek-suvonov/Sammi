export interface Technology {
  id: number
  name: string
}

export interface TechnologyListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Technology[]
}

export interface TechnologyQueryParams {
  page?: number
  page_size?: number
  search?: string
  ordering?: string
}
