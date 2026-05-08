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

export interface Module {
  id: number
  course: number
  title: string
  order: number
  lessons: Lesson[] // Modul ichidagi darslar ro'yxati
}

export interface LessonCreateRequest {
  module: number
  title: string
  video_url: string
  duration: number
  order: number
  is_preview: boolean
}

export interface LessonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Lesson[]
}