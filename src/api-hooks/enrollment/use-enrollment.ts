import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EnrollmentService } from '@/service/enrollment/enrollment.service'
import type {
  CreateEnrollmentRequest,
  EnrollmentQueryParams,
} from '@/service/enrollment/enrollment.type'

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  list: (params?: EnrollmentQueryParams) =>
    [...enrollmentKeys.all, 'list', params] as const,
  detail: (id: number | string) =>
    [...enrollmentKeys.all, 'detail', String(id)] as const,
}

export function useEnrollments(params?: EnrollmentQueryParams) {
  return useQuery({
    queryKey: enrollmentKeys.list(params),
    queryFn: () => EnrollmentService.list(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useEnrollment(id: number | string | undefined) {
  return useQuery({
    queryKey: enrollmentKeys.detail(id ?? ''),
    queryFn: () => EnrollmentService.detail(id as number | string),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Silent mutation — 400 "already enrolled" is expected and not shown as error
export function useCreateEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEnrollmentRequest) => EnrollmentService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: enrollmentKeys.all })
    },
  })
}

export function useDeleteEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => EnrollmentService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: enrollmentKeys.all })
    },
  })
}
