import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  PaginatedResponse,
  ProjectDetail,
  ProjectFilters,
  ProjectListItem,
  ProjectPatchRequest,
  ProjectRequest,
  ProjectStep,
  StepPatchRequest,
  StepReorderRequest,
  StepRequest,
} from './projects.type'

// ─── FormData builder ─────────────────────────────────────────────────────────

type AnyRequest =
  | Partial<ProjectRequest>
  | Partial<StepRequest>
  | StepPatchRequest

const buildFormData = (payload: AnyRequest): FormData => {
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
      fd.append(key, String(value))
    }
  }
  return fd
}

const hasFile = (payload: AnyRequest): boolean =>
  Object.values(payload).some((v) => v instanceof File)

// ─── Service ──────────────────────────────────────────────────────────────────

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
        { headers: { 'Content-Type': undefined } }
      )
    }
    return api.post<ProjectDetail>(API_ENDPOINTS.PROJECTS.CREATE, data)
  }

  static update(id: number | string, data: ProjectRequest): Promise<ProjectDetail> {
    const url = API_ENDPOINTS.PROJECTS.UPDATE.replace(':id', String(id))
    if (hasFile(data)) {
      return api.put<ProjectDetail>(url, buildFormData(data), {
        headers: { 'Content-Type': undefined },
      })
    }
    return api.put<ProjectDetail>(url, data)
  }

  static patch(id: number | string, data: ProjectPatchRequest): Promise<ProjectDetail> {
    const url = API_ENDPOINTS.PROJECTS.PATCH.replace(':id', String(id))
    if (hasFile(data)) {
      return api.patch<ProjectDetail>(url, buildFormData(data), {
        headers: { 'Content-Type': undefined },
      })
    }
    return api.patch<ProjectDetail>(url, data)
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.PROJECTS.DELETE.replace(':id', String(id))
    return api.delete(url)
  }

  static stepDetail(id: number | string): Promise<ProjectStep> {
    const url = API_ENDPOINTS.PROJECTS.STEP_DETAIL.replace(':id', String(id))
    return api.get<ProjectStep>(url)
  }

  static createStep(data: StepRequest): Promise<ProjectStep> {
    if (hasFile(data)) {
      return api.post<ProjectStep>(
        API_ENDPOINTS.PROJECTS.STEP_CREATE,
        buildFormData(data),
        { headers: { 'Content-Type': undefined } }
      )
    }
    return api.post<ProjectStep>(API_ENDPOINTS.PROJECTS.STEP_CREATE, data)
  }

  static updateStep(id: number | string, data: StepRequest): Promise<ProjectStep> {
    const url = API_ENDPOINTS.PROJECTS.STEP_UPDATE.replace(':id', String(id))
    if (hasFile(data)) {
      return api.put<ProjectStep>(url, buildFormData(data), {
        headers: { 'Content-Type': undefined },
      })
    }
    return api.put<ProjectStep>(url, data)
  }

  static patchStep(id: number | string, data: StepPatchRequest): Promise<ProjectStep> {
    const url = API_ENDPOINTS.PROJECTS.STEP_PATCH.replace(':id', String(id))
    if (hasFile(data)) {
      return api.patch<ProjectStep>(url, buildFormData(data), {
        headers: { 'Content-Type': undefined },
      })
    }
    return api.patch<ProjectStep>(url, data)
  }

  static deleteStep(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.PROJECTS.STEP_DELETE.replace(':id', String(id))
    return api.delete(url)
  }

  static reorderSteps(data: StepReorderRequest): Promise<ProjectStep[]> {
    return api.post<ProjectStep[], StepReorderRequest>(
      API_ENDPOINTS.PROJECTS.STEP_REORDER,
      data,
    )
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
  updateStep,
  patchStep,
  deleteStep,
  reorderSteps,
} = ProjectsService

export default ProjectsService
