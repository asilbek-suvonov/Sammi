import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  PaginatedResponse,
  ProjectDetail,
  ProjectFilters,
  ProjectListItem,
  ProjectRequest,
  Step,
  StepRequest,
} from './projects.type'

const buildFormData = (payload: Partial<ProjectRequest> | Partial<StepRequest>): FormData => {
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

const hasFile = (payload: Partial<ProjectRequest> | Partial<StepRequest>): boolean =>
  Object.values(payload).some((v) => v instanceof File)

export class ProjectsService {
  static list(params?: ProjectFilters): Promise<PaginatedResponse<ProjectListItem>> {
    return api.get<PaginatedResponse<ProjectListItem>>(API_ENDPOINTS.PROJECTS.LIST, { params })
  }

  static detail(id: number | string): Promise<ProjectDetail> {
    const url = API_ENDPOINTS.PROJECTS.DETAIL.replace(':id', String(id))
    return api.get<ProjectDetail>(url)
  }

  static create(data: ProjectRequest): Promise<ProjectDetail> {
    if (hasFile(data)) {
      return api.post<ProjectDetail>(
        API_ENDPOINTS.PROJECTS.CREATE,
        buildFormData(data),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
    }
    return api.post<ProjectDetail>(API_ENDPOINTS.PROJECTS.CREATE, data)
  }

  static update(id: number | string, data: ProjectRequest): Promise<ProjectDetail> {
    const url = API_ENDPOINTS.PROJECTS.UPDATE.replace(':id', String(id))
    if (hasFile(data)) {
      return api.put<ProjectDetail>(url, buildFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.put<ProjectDetail>(url, data)
  }

  static patch(id: number | string, data: Partial<ProjectRequest>): Promise<ProjectDetail> {
    const url = API_ENDPOINTS.PROJECTS.PATCH.replace(':id', String(id))
    if (hasFile(data)) {
      return api.patch<ProjectDetail>(url, buildFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.patch<ProjectDetail>(url, data)
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.PROJECTS.DELETE.replace(':id', String(id))
    return api.delete(url)
  }

  static stepDetail(id: number | string): Promise<Step> {
    const url = API_ENDPOINTS.PROJECTS.STEP_DETAIL.replace(':id', String(id))
    return api.get<Step>(url)
  }

  static createStep(data: StepRequest): Promise<Step> {
    if (hasFile(data)) {
      return api.post<Step>(API_ENDPOINTS.PROJECTS.STEP_CREATE, buildFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.post<Step>(API_ENDPOINTS.PROJECTS.STEP_CREATE, data)
  }
}

export const {
  list: getProjectsList,
  detail: getProjectDetail,
  create: createProject,
  
  update: updateProject,
  patch: patchProject,
  delete: deleteProject,
  stepDetail: getStepDetail,
  createStep,
} = ProjectsService

export default ProjectsService
