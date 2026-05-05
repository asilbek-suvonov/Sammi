import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type { CourseListResponse, CourseQueryParams } from './course.types'

export const getCourseList = async (params?: CourseQueryParams): Promise<CourseListResponse> => {
  return api.get<CourseListResponse>(API_ENDPOINTS.COURSE.LIST, { params })
}