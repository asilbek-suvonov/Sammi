import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type{ CourseListResponse } from './course.types'

export const getCourseList = async (params?: any): Promise<CourseListResponse> => {
  const response = await api.get<CourseListResponse>(
    API_ENDPOINTS.COURSE.LIST,
    { params } 
  )
  return response.data
}