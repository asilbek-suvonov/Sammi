import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LessonProgressService } from '@/service/lesson-progress/progress.service'
import type {
  LessonProgressQueryParams,
  LessonProgressRequest,
} from '@/service/lesson-progress/progress.type'

export const progressKeys = {
  all: ['lesson-progress'] as const,
  list: (params?: LessonProgressQueryParams) =>
    [...progressKeys.all, 'list', params] as const,
  detail: (id: number | string) =>
    [...progressKeys.all, 'detail', String(id)] as const,
}

export function useLessonProgressList(
  params?: LessonProgressQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: progressKeys.list(params),
    queryFn: () => LessonProgressService.list(params),
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000,
  })
}

// POST — create new progress record (silent 400 handled at service layer)
export function useCreateLessonProgress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: LessonProgressRequest) => LessonProgressService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: progressKeys.all })
    },
  })
}

// PATCH — update existing progress record
export function usePatchLessonProgress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string
      data: Partial<LessonProgressRequest>
    }) => LessonProgressService.patch(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: progressKeys.all })
    },
  })
}
