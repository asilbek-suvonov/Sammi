import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  LessonProgress,
  LessonProgressListResponse,
  LessonProgressQueryParams,
  LessonProgressRequest,
  LessonProgressShortResponse,
} from './progress.type'

export class LessonProgressService {
  static list(params?: LessonProgressQueryParams): Promise<LessonProgressListResponse> {
    return api.get<LessonProgressListResponse>(
      API_ENDPOINTS.LESSON_PROGRESS.LIST,
      { params },
    )
  }

  static detail(id: number | string): Promise<LessonProgress> {
    const url = API_ENDPOINTS.LESSON_PROGRESS.DETAIL.replace(':id', String(id))
    return api.get<LessonProgress>(url)
  }

  // silent: true — 400 "already exists" is handled by caller (falls back to patch)
  static create(data: LessonProgressRequest): Promise<LessonProgressShortResponse> {
    return api.post<LessonProgressShortResponse>(
      API_ENDPOINTS.LESSON_PROGRESS.CREATE,
      data,
      { silent: true },
    )
  }

  static update(
    id: number | string,
    data: LessonProgressRequest,
  ): Promise<LessonProgressShortResponse> {
    const url = API_ENDPOINTS.LESSON_PROGRESS.UPDATE.replace(':id', String(id))
    return api.put<LessonProgressShortResponse>(url, data)
  }

  static patch(
    id: number | string,
    data: Partial<LessonProgressRequest>,
  ): Promise<LessonProgressShortResponse> {
    const url = API_ENDPOINTS.LESSON_PROGRESS.PATCH.replace(':id', String(id))
    return api.patch<LessonProgressShortResponse>(url, data)
  }
}

export const {
  list: getLessonProgressList,
  detail: getLessonProgressDetail,
  create: createLessonProgress,
  update: updateLessonProgress,
  patch: patchLessonProgress,
} = LessonProgressService

export default LessonProgressService
