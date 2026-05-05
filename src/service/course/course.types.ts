export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Course {
  id: number
  title: string
  description: string
  image_url: string
  preview_video_url_full: string
  preview_video_url: string
  category_name: string
  technologies_list: string[]
  level: CourseLevel
  price: string
  is_free: boolean
  is_new: boolean
  is_published?: boolean
}

export interface CourseListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Course[]
}

export interface CourseQueryParams {
  page?: number
  page_size?: number
  search?: string
  ordering?: string
  level?: CourseLevel
  category?: string
  is_free?: boolean
}

export interface CourseRequest {
  title: string
  description: string
  image?: File | string
  preview_video_url?: string
  category?: string | number
  technologies?: number[]
  level: CourseLevel
  price: string
  is_free?: boolean
  is_new?: boolean
  is_published?: boolean
}
