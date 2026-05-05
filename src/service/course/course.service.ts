import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  Course,
  CourseListResponse,
  CourseQueryParams,
  CourseRequest,
} from './course.types'

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

const hasFile = (payload: Partial<CourseRequest>): boolean =>
  Object.values(payload).some((v) => v instanceof File)

export class CourseService {
  static list(params?: CourseQueryParams): Promise<CourseListResponse> {
    return api.get<CourseListResponse>(API_ENDPOINTS.COURSE.LIST, { params })
  }

  static detail(id: number | string): Promise<Course> {
    const url = API_ENDPOINTS.COURSE.DETAIL.replace(':id', String(id))
    return api.get<Course>(url)
  }

  static create(data: CourseRequest): Promise<Course> {
    if (hasFile(data)) {
      return api.post<Course>(API_ENDPOINTS.COURSE.CREATE, buildFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.post<Course>(API_ENDPOINTS.COURSE.CREATE, data)
  }

  static update(id: number | string, data: CourseRequest): Promise<Course> {
    const url = API_ENDPOINTS.COURSE.UPDATE.replace(':id', String(id))
    if (hasFile(data)) {
      return api.put<Course>(url, buildFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.put<Course>(url, data)
  }

  static patch(id: number | string, data: Partial<CourseRequest>): Promise<Course> {
    const url = API_ENDPOINTS.COURSE.PATCH.replace(':id', String(id))
    if (hasFile(data)) {
      return api.patch<Course>(url, buildFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.patch<Course>(url, data)
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
