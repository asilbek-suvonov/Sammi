import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  Course,
  CourseDetail,
  CourseListResponse,
  CourseQueryParams,
  CourseRequest,
} from './course.types'

/**
 * Course API ONLY accepts multipart/form-data (never JSON).
 * All write methods always build FormData regardless of file presence.
 */
const buildFormData = (payload: Partial<CourseRequest>): FormData => {
  const fd = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, String(v)))
    } else if (value instanceof File) {
      fd.append(key, value)
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? 'true' : 'false')
    } else {
      fd.append(key, value as string)
    }
  }
  return fd
}

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

export class CourseService {
  static list(params?: CourseQueryParams): Promise<CourseListResponse> {
    return api.get<CourseListResponse>(API_ENDPOINTS.COURSE.LIST, { params })
  }

  static detail(id: number | string): Promise<CourseDetail> {
    const url = API_ENDPOINTS.COURSE.DETAIL.replace(':id', String(id))
    return api.get<CourseDetail>(url)
  }

  static create(data: CourseRequest): Promise<CourseDetail> {
    return api.post<CourseDetail>(API_ENDPOINTS.COURSE.CREATE, buildFormData(data), multipart)
  }

  static update(id: number | string, data: CourseRequest): Promise<CourseDetail> {
    const url = API_ENDPOINTS.COURSE.UPDATE.replace(':id', String(id))
    return api.put<CourseDetail>(url, buildFormData(data), multipart)
  }

  static patch(id: number | string, data: Partial<CourseRequest>): Promise<CourseDetail> {
    const url = API_ENDPOINTS.COURSE.PATCH.replace(':id', String(id))
    return api.patch<CourseDetail>(url, buildFormData(data), multipart)
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.COURSE.DELETE.replace(':id', String(id))
    return api.delete(url)
  }
}

export const {
  list: getCourseList,
  detail: getCourseDetail,
  create: createCourse,
  update: updateCourse,
  patch: patchCourse,
  delete: deleteCourse,
} = CourseService

export default CourseService
