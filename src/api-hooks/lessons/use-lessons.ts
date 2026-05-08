import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createLesson,
  deleteLesson,
  updateLesson,
} from '../../service/lessons/lessons.service'
import type { LessonRequest } from '@/service/lessons/lessons.types'

export const lessonKeys = {
  all: ['lessons'] as const,
}

// 4. Create Lesson Hook
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

// 5. Update Lesson Hook
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

// 6. Delete Lesson Hook
export function useDeleteLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => deleteLesson(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['modules'] })
      qc.invalidateQueries({ queryKey: lessonKeys.all })
      toast.success("Dars o'chirildi")
    },
    onError: () => {
      toast.error("Darsni o'chirishda xatolik yuz berdi")
    }
  })
}