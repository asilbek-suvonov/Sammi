import axios from 'axios' // yoki o'zingizning custom axios instancingiz
import { Lesson, LessonCreateRequest, LessonListResponse } from './lessons.types'

export const LessonService = {
  // Barcha darslarni olish
  getList: async () => {
    const { data } = await axios.get<LessonListResponse>('/lessons/list')
    return data
  },

  // Bitta dars tafsilotlarini olish
  getDetail: async (id: number) => {
    const { data } = await axios.get<Lesson>(`/lessons/detail/${id}/`)
    return data
  },

  // Yangi dars yaratish
  create: async (payload: LessonCreateRequest) => {
    const { data } = await axios.post<Lesson>('/lessons/', payload)
    return data
  },

  // Darsni tahrirlash
  update: async (id: number, payload: LessonCreateRequest) => {
    const { data } = await axios.put<Lesson>(`/lessons/${id}/`, payload)
    return data
  },

  // Darsni o'chirish
  delete: async (id: number) => {
    await axios.delete(`/lessons/delete/${id}/`)
  }
}