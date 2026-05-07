import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCourse,
  deleteCourse,
  getCourseDetail,
  getCourseList,
  patchCourse,
  updateCourse,
} from '@/service/course/course.service'
import type {
  Course,
  CourseListResponse,
  CourseQueryParams,
  CourseRequest,
} from '@/service/course/course.types'

export const courseKeys = {
  all: ['courses'] as const,
  list: (params?: CourseQueryParams) => [...courseKeys.all, 'list', params] as const,
  detail: (id: number | string) => [...courseKeys.all, 'detail', String(id)] as const,
}

export function useCourses(params?: CourseQueryParams) {
  return useQuery<Course[], Error>({
    queryKey: courseKeys.list(params),
    queryFn: async () => {
      const res = await getCourseList(params)
      return res.results
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCoursesPaginated(params?: CourseQueryParams) {
  return useQuery<CourseListResponse, Error>({
    queryKey: courseKeys.list(params),
    queryFn: () => getCourseList(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCourse(id: number | string | undefined, enabled = true) {
  return useQuery<Course, Error>({
    queryKey: courseKeys.detail(id ?? ''),
    queryFn: () => getCourseDetail(id as number | string),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation<Course, Error, CourseRequest>({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success('Course created successfully')
      qc.invalidateQueries({ queryKey: courseKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create course')
    },
  })
}

export function useUpdateCourse() {
  const qc = useQueryClient()
  return useMutation<
    Course,
    Error,
    { id: number | string; data: CourseRequest }
  >({
    mutationFn: ({ id, data }) => updateCourse(id, data),
    onSuccess: (_, vars) => {
      toast.success('Course updated successfully')
      qc.invalidateQueries({ queryKey: courseKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: courseKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update course')
    },
  })
}

export function usePatchCourse() {
  const qc = useQueryClient()
  return useMutation<
    Course,
    Error,
    { id: number | string; data: Partial<CourseRequest> }
  >({
    mutationFn: ({ id, data }) => patchCourse(id, data),
    onSuccess: (_, vars) => {
      toast.success('Course updated successfully')
      qc.invalidateQueries({ queryKey: courseKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: courseKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update course')
    },
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success('Course deleted successfully')
      qc.invalidateQueries({ queryKey: courseKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete course')
    },
  })
}
