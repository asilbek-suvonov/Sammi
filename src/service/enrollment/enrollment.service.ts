import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  CreateEnrollmentRequest,
  CreateEnrollmentResponse,
  Enrollment,
  EnrollmentListResponse,
  EnrollmentQueryParams,
} from './enrollment.type'

export class EnrollmentService {
  static list(params?: EnrollmentQueryParams): Promise<EnrollmentListResponse> {
    return api.get<EnrollmentListResponse>(API_ENDPOINTS.ENROLLMENT.LIST, { params })
  }

  static detail(id: number | string): Promise<Enrollment> {
    const url = API_ENDPOINTS.ENROLLMENT.DETAIL.replace(':id', String(id))
    return api.get<Enrollment>(url)
  }

  static create(data: CreateEnrollmentRequest): Promise<CreateEnrollmentResponse> {
    // silent: true — 403 (already enrolled / no permission) is expected and not shown as toast
    return api.post<CreateEnrollmentResponse>(
      API_ENDPOINTS.ENROLLMENT.CREATE,
      data,
      { silent: true },
    )
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.ENROLLMENT.DELETE.replace(':id', String(id))
    return api.delete(url)
  }
}

export const {
  list: getEnrollmentList,
  detail: getEnrollmentDetail,
  create: createEnrollment,
  delete: deleteEnrollment,
} = EnrollmentService

export default EnrollmentService
