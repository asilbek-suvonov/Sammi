import api from '@/api'
import { ENDPOINTS } from '@/endpoints/api_endpoints'
import { CourseListResponse } from './course.types'

export const getCourseList = async (params?: any): Promise<CourseListResponse> => {
  const response = await api.get<CourseListResponse>(
    ENDPOINTS.COURSES.LIST,
    { params } 
  )
  return response.data
}