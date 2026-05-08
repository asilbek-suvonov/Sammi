import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createLesson,
  deleteLesson,
  getLessonList,
  updateLesson,
} from '@/service/lessons/lessons.service'
import type { LessonQueryParams, LessonRequest } from '@/service/lessons/lessons.types'

export const lessonKeys = {
  all: ['lessons'] as const,
  list: (params?: LessonQueryParams) => [...lessonKeys.all, 'list', params] as const,
  detail: (id: number | string) => [...lessonKeys.all, 'detail', String(id)] as const,
}

export function useGetLessons(params?: LessonQueryParams) {
  return useQuery({
    queryKey: lessonKeys.list(params),
    queryFn: () => getLessonList(params),
  })
}

export function useCreateLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.all })
      qc.invalidateQueries({ queryKey: ['modules'] })
      toast.success("Dars muvaffaqiyatli qo'shildi")
    },
  })
}

export function useUpdateLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: LessonRequest }) =>
      updateLesson(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.all })
      qc.invalidateQueries({ queryKey: ['modules'] })
      toast.success('Dars yangilandi')
    },
  })
}

export function useDeleteLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => deleteLesson(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.all })
      qc.invalidateQueries({ queryKey: ['modules'] })
      toast.error("Dars o'chirildi")
    },
  })
}
