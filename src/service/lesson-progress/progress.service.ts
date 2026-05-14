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

  /**
   * Create a progress row if missing; if it already exists, fall back to patching it.
   * Keeps progress persistence reliable even when the client doesn't have the row id yet.
   */
  static async upsertCompleted(lessonId: number): Promise<LessonProgressShortResponse> {
    try {
      return await LessonProgressService.create({ lesson: lessonId, is_completed: true })
    } catch {
      const list = await LessonProgressService.list()
      const found = list.results.find((p) => {
        const id = typeof p.lesson === 'number' ? p.lesson : p.lesson.id
        return id === lessonId
      })
      if (!found) throw new Error('Lesson progress row not found')
      return LessonProgressService.patch(found.id, { is_completed: true })
    }
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
