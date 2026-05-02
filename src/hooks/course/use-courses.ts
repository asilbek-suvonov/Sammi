import { useQuery } from '@tanstack/react-query'
import { getCourseList } from '../../service/course/course.service' 
import { CourseListResponse } from '../../service/course/course.types'

// Query Key larni alohida obyektda saqlash yaxshi amaliyot (Key Management)
export const courseKeys = {
  all: ['courses'] as const,
  list: (params?: any) => [...courseKeys.all, 'list', params] as const,
}

/**
 * Kurslar ro'yxatini olish uchun Hook
 */
export function useCourses(params?: any) {
  return useQuery<CourseListResponse>({
    queryKey: courseKeys.list(params),
    queryFn: () => getCourseList(params),
    // 10 soniya davomida ma'lumotni "yangi" deb hisoblaydi (Sening QueryClient sozlamangga mos)
    staleTime: 10 * 1000, 
  })
}