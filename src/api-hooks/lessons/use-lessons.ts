import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createLesson,
  deleteLesson,
  getLessonList,
  updateLesson,
  getModuleDetail, 
} from '../../service/lessons/lessons.service'
import type { LessonQueryParams, LessonRequest } from '@/service/lessons/lessons.types'

// 1. Query Keys - Keshni boshqarish uchun markazlashgan kalitlar
export const lessonKeys = {
  all: ['lessons'] as const,
  lists: () => [...lessonKeys.all, 'list'] as const,
  list: (params?: LessonQueryParams) => [...lessonKeys.lists(), params] as const,
  details: () => [...lessonKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...lessonKeys.details(), String(id)] as const,
  moduleDetails: (moduleId: number | string | null) => ['module-details', moduleId] as const,
}

// 2. Get Lessons Hook
export function useGetLessons(params?: LessonQueryParams) {
  return useQuery({
    queryKey: lessonKeys.list(params),
    queryFn: () => getLessonList(params),
  })
}

// 3. Module Details Hook (Darslar ro'yxati shu kalit orqali yangilanadi)
export const useGetModuleDetails = (moduleId: number | null) => {
  return useQuery({
    queryKey: lessonKeys.moduleDetails(moduleId),
    queryFn: () => getModuleDetail(moduleId!),
    enabled: !!moduleId,
  })
}

// 4. Create Lesson Hook
export function useCreateLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createLesson,
    onSuccess: (_, variables) => {
      // Tegishli barcha keshni tozalash
      qc.invalidateQueries({ queryKey: lessonKeys.all })
      qc.invalidateQueries({ queryKey: ['modules'] })
      qc.invalidateQueries({ queryKey: lessonKeys.moduleDetails(variables.module) })
      toast.success("Dars muvaffaqiyatli qo'shildi")
    },
  })
}

// 5. Update Lesson Hook
export function useUpdateLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: LessonRequest }) =>
      updateLesson(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: lessonKeys.all })
      qc.invalidateQueries({ queryKey: ['modules'] })
      qc.invalidateQueries({ queryKey: lessonKeys.moduleDetails(variables.data.module) })
      toast.success('Dars yangilandi')
    },
  })
}

// 6. Delete Lesson Hook
export function useDeleteLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => deleteLesson(id),
    onSuccess: () => {
      // Dars o'chganda hamma bog'liq joylar yangilanishi shart
      qc.invalidateQueries({ queryKey: ['module-details'] }) 
      qc.invalidateQueries({ queryKey: ['modules'] })
      qc.invalidateQueries({ queryKey: lessonKeys.all })
      toast.success("Dars o'chirildi")
    },
    onError: () => {
      toast.error("Darsni o'chirishda xatolik yuz berdi")
    }
  })
}