import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LessonService } from '../../service/lessons/lessons.service'
import { LessonCreateRequest } from '../../service/lessons/lessons.types'
import { toast } from 'sonner'

// 1. Get Lessons Hook
export const useGetLessons = () => {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: LessonService.getList,
  })
}

// 2. Create Lesson Hook
export const useCreateLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: LessonService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] })
      queryClient.invalidateQueries({ queryKey: ['module-details'] }) // Buni qo'shing
      toast.success("Dars qo'shildi")
    },
  })
}

// 3. Update Lesson Hook
export const useUpdateLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LessonCreateRequest }) =>
      LessonService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] })
      toast.success('Dars yangilandi')
    },
  })
}

// 4. Delete Lesson Hook
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => LessonService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-details'] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success("Dars o'chirildi");
    },
    onError: () => toast.error("Darsni o'chirishda xatolik yuz berdi")
  });
};

export const useGetModuleDetails = (moduleId: number | null) => {
  return useQuery({
    queryKey: ['module-details', moduleId],
    queryFn: () => LessonService.getModuleDetail(moduleId!),
    enabled: !!moduleId,
  })
}
