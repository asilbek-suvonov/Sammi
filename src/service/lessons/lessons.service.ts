import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints' // Endpointlar shu yerda markazlashgan bo'lishi yaxshi
import type {
  Lesson,
  LessonListResponse,
  LessonQueryParams,
  LessonRequest,
} from './lessons.types'

/**
 * Agar darsda video fayl bo'lsa, ma'lumotlarni FormData formatida yuborish kerak.
 * Aks holda oddiy JSON yuboriladi.
 */
function buildLessonBody(data: LessonRequest) {
  if (!data.video) return data // Fayl bo'lmasa JSON formatda qaytaradi

  const form = new FormData()
  form.append('module', String(data.module))
  form.append('title', data.title)
  form.append('video', data.video) // Fayl (File obyekti)
  
  if (data.video_url) form.append('video_url', data.video_url)
  if (data.duration != null) form.append('duration', String(data.duration))
  if (data.order != null) form.append('order', String(data.order))
  if (data.is_preview != null) form.append('is_preview', String(data.is_preview))
  
  return form
}

export const LessonService = {
  // Barcha darslarni olish
  getList: async (params?: LessonQueryParams) => {
    return await api.get<LessonListResponse>(API_ENDPOINTS.LESSON.LIST || '/lessons/list/', { params })
  },

  // Bitta dars tafsilotlari
  getDetail: async (id: number | string) => {
    const url = API_ENDPOINTS.LESSON.DETAIL?.replace(':id', String(id)) || `/lessons/detail/${id}/`
    return await api.get<Lesson>(url)
  },

  // Yangi dars yaratish
  create: async (payload: LessonRequest) => {
    const body = buildLessonBody(payload)
    return await api.post<Lesson>(API_ENDPOINTS.LESSON.CREATE || '/lessons/', body)
  },

  // Darsni to'liq tahrirlash (PUT)
  update: async (id: number | string, payload: LessonRequest) => {
    const url = API_ENDPOINTS.LESSON.UPDATE?.replace(':id', String(id)) || `/lessons/${id}/`
    const body = buildLessonBody(payload)
    return await api.put<Lesson>(url, body)
  },

  // Darsni qisman tahrirlash (PATCH)
  patch: async (id: number | string, payload: Partial<LessonRequest>) => {
    const url = API_ENDPOINTS.LESSON.PATCH?.replace(':id', String(id)) || `/lessons/${id}/`
    return await api.patch<Lesson>(url, payload)
  },

  // Darsni o'chirish
  delete: async (id: number | string) => {
    const url = API_ENDPOINTS.LESSON.DELETE?.replace(':id', String(id)) || `/lessons/delete/${id}/`
    return await api.delete(url)
  },

  // Modul tafsilotlarini olish (Darslar bilan birga)
  getModuleDetail: async (id: number | string) => {
    return await api.get<any>(`/modules/detail/${id}/`)
  },
}

// Named export'lar (hook'larda ishlatish uchun qulay)
export const {
  getList: getLessonList,
  getDetail: getLessonDetail,
  create: createLesson,
  update: updateLesson,
  patch: patchLesson,
  delete: deleteLesson,
  getModuleDetail,
} = LessonService

export default LessonService