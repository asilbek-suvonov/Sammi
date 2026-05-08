// 1. Standart axios emas, o'zingiz yaratgan api instance'ni import qiling
import api from '../../api/index' // api-client faylingiz manzili
import { Lesson, LessonCreateRequest, LessonListResponse } from './lessons.types'

export const LessonService = {
  // Barcha darslarni olish
  getList: async () => {
    // api.get o'zi res.data ni qaytaradi (siz interceptor'da shunday yozgansiz)
    return await api.get<LessonListResponse>('/lessons/list')
  },

  // Bitta dars tafsilotlarini olish
  getDetail: async (id: number) => {
    return await api.get<Lesson>(`/lessons/detail/${id}/`)
  },

  // Yangi dars yaratish
  create: async (payload: LessonCreateRequest) => {
    // Swagger'da oxirida slash bor: /lessons/
    return await api.post<Lesson>('/lessons/', payload)
  },

  // Darsni tahrirlash
  update: async (id: number, payload: LessonCreateRequest) => {
    // URL: /lessons/{id}/
    return await api.put<Lesson>(`/lessons/${id}/`, payload)
  },

  // Darsni o'chirish
  delete: async (id: number) => {
    return await api.delete(`/lessons/delete/${id}/`)
  },

  getModuleDetail: async (id: number) => {
    return await api.get<any>(`/modules/detail/${id}/`) 
  },
}

