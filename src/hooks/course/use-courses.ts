import { useQuery } from '@tanstack/react-query'
import { getCourseList } from '../../service/course/course.service'
import type { Course, CourseListResponse, CourseQueryParams } from '../../service/course/course.types'

export const courseKeys = {
  all: ['courses'] as const,
  list: (params?: CourseQueryParams) => [...courseKeys.all, 'list', params] as const,
}

const toCourseArray = (raw: unknown): Course[] => {
  if (Array.isArray(raw)) return raw as Course[]
  if (raw && typeof raw === 'object' && 'results' in raw) {
    const results = (raw as CourseListResponse).results
    return Array.isArray(results) ? results : []
  }
  return []
}

export function useCourses(params?: CourseQueryParams) {
  return useQuery<Course[]>({
    queryKey: courseKeys.list(params),
    queryFn: async () => toCourseArray(await getCourseList(params)),
    staleTime: 10 * 1000,
  })
}
