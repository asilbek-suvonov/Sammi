import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  Lesson,
  LessonListResponse,
  LessonQueryParams,
  LessonRequest,
} from './lessons.types'

export class LessonService {
  static list(params?: LessonQueryParams): Promise<LessonListResponse> {
    return api.get<LessonListResponse>(API_ENDPOINTS.LESSON.LIST, { params })
  }

  static detail(id: number | string): Promise<Lesson> {
    const url = API_ENDPOINTS.LESSON.DETAIL.replace(':id', String(id))
    return api.get<Lesson>(url)
  }

  static create(data: LessonRequest): Promise<Lesson> {
    return api.post<Lesson>(API_ENDPOINTS.LESSON.CREATE, data)
  }

  static update(id: number | string, data: LessonRequest): Promise<Lesson> {
    const url = API_ENDPOINTS.LESSON.UPDATE.replace(':id', String(id))
    return api.put<Lesson>(url, data)
  }

  static patch(id: number | string, data: Partial<LessonRequest>): Promise<Lesson> {
    const url = API_ENDPOINTS.LESSON.PATCH.replace(':id', String(id))
    return api.patch<Lesson>(url, data)
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.LESSON.DELETE.replace(':id', String(id))
    return api.delete(url)
  }
}

export const {
  list: getLessonList,
  detail: getLessonDetail,
  create: createLesson,
  update: updateLesson,
  patch: patchLesson,
  delete: deleteLesson,
} = LessonService

export default LessonService
