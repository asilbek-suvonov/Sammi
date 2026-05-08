import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  Lesson,
  LessonListResponse,
  LessonQueryParams,
  LessonRequest,
} from './lessons.types'

function buildLessonFormData(data: LessonRequest): FormData {
  const form = new FormData()
  form.append('module', String(data.module))
  form.append('title', data.title)
  if (data.video) form.append('video', data.video)
  if (data.video_url) form.append('video_url', data.video_url)
  if (data.duration != null) form.append('duration', String(data.duration))
  if (data.order != null) form.append('order', String(data.order))
  if (data.is_preview != null) form.append('is_preview', String(data.is_preview))
  return form
}

export class LessonService {
  static list(params?: LessonQueryParams): Promise<LessonListResponse> {
    return api.get<LessonListResponse>(API_ENDPOINTS.LESSON.LIST, { params })
  }

  static detail(id: number | string): Promise<Lesson> {
    const url = API_ENDPOINTS.LESSON.DETAIL.replace(':id', String(id))
    return api.get<Lesson>(url)
  }

  static create(data: LessonRequest): Promise<Lesson> {
    const body = data.video ? buildLessonFormData(data) : data
    return api.post<Lesson>(API_ENDPOINTS.LESSON.CREATE, body)
  }

  static update(id: number | string, data: LessonRequest): Promise<Lesson> {
    const url = API_ENDPOINTS.LESSON.UPDATE.replace(':id', String(id))
    const body = data.video ? buildLessonFormData(data) : data
    return api.put<Lesson>(url, body)
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
