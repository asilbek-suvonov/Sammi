import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  PaginatedResponse,
  ProjectFilters,
  ProjectListItem,
  ProjectPatchRequest,
  ProjectRequest,
  ProjectStep,
  StepPatchRequest,
  StepReorderRequest,
  StepRequest,
} from './projects.type'

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

const buildFormData = (payload: Record<string, any>): FormData => {
  const fd = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, v instanceof File ? v : String(v)))
    } else if (value instanceof File) {
      fd.append(key, value)
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? 'true' : 'false')
    } else if (typeof value === 'object') {
      continue
    } else {
      fd.append(key, String(value))
    }
  }
  return fd
}

const hasProjectFile = (data: ProjectRequest | ProjectPatchRequest): boolean =>
  data.image instanceof File

export class ProjectsService {
  // --- Projects ---
  static list(params?: ProjectFilters): Promise<PaginatedResponse<ProjectListItem>> {
    return api.get(API_ENDPOINTS.PROJECTS.LIST, { params })
  }

  static create(data: ProjectRequest): Promise<ProjectListItem> {
    if (hasProjectFile(data)) {
      return api.post<ProjectListItem>(
        API_ENDPOINTS.PROJECTS.CREATE,
        buildFormData(data),
        multipart,
      )
    }
    return api.post<ProjectListItem>(API_ENDPOINTS.PROJECTS.CREATE, data)
  }

  static update(id: number | string, data: ProjectRequest): Promise<ProjectListItem> {
    const url = API_ENDPOINTS.PROJECTS.UPDATE.replace(':id', String(id))
    if (hasProjectFile(data)) {
      return api.put<ProjectListItem>(url, buildFormData(data), multipart)
    }
    return api.put<ProjectListItem>(url, data)
  }

  static patch(id: number | string, data: ProjectPatchRequest): Promise<ProjectListItem> {
    const url = API_ENDPOINTS.PROJECTS.PATCH.replace(':id', String(id))
    if (hasProjectFile(data)) {
      return api.patch<ProjectListItem>(url, buildFormData(data), multipart)
    }
    return api.patch<ProjectListItem>(url, data)
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.PROJECTS.DELETE.replace(':id', String(id))
    return api.delete(url)
  }

  // --- Steps ---

  // GET /projects/:project_pk/steps/
  static stepList(projectPk: number | string): Promise<PaginatedResponse<ProjectStep>> {
    const url = API_ENDPOINTS.PROJECTS.STEP_LIST.replace(':project_pk', String(projectPk))
    return api.get(url)
  }

  // GET /projects/:project_pk/steps/:id/
  static stepDetail(projectPk: number | string, id: number | string): Promise<ProjectStep> {
    const url = API_ENDPOINTS.PROJECTS.STEP_DETAIL
      .replace(':project_pk', String(projectPk))
      .replace(':id', String(id))
    return api.get(url)
  }

  // POST /projects/:project_pk/steps/create/
  static createStep(projectPk: number | string, data: StepRequest): Promise<ProjectStep> {
    const url = API_ENDPOINTS.PROJECTS.STEP_CREATE.replace(':project_pk', String(projectPk))
    return api.post(url, buildFormData(data), multipart)
  }

  // PUT /projects/:project_pk/steps/:id/update/
  static updateStep(
    projectPk: number | string,
    id: number | string,
    data: StepRequest,
  ): Promise<ProjectStep> {
    const url = API_ENDPOINTS.PROJECTS.STEP_UPDATE
      .replace(':project_pk', String(projectPk))
      .replace(':id', String(id))
    return api.put(url, buildFormData(data), multipart)
  }

  // PATCH /projects/:project_pk/steps/:id/update/
  static patchStep(
    projectPk: number | string,
    id: number | string,
    data: StepPatchRequest,
  ): Promise<ProjectStep> {
    const url = API_ENDPOINTS.PROJECTS.STEP_PATCH
      .replace(':project_pk', String(projectPk))
      .replace(':id', String(id))
    return api.patch(url, buildFormData(data), multipart)
  }

  // DELETE /projects/:project_pk/steps/:id/delete/
  static deleteStep(projectPk: number | string, id: number | string): Promise<void> {
    const url = API_ENDPOINTS.PROJECTS.STEP_DELETE
      .replace(':project_pk', String(projectPk))
      .replace(':id', String(id))
    return api.delete(url)
  }

  static reorderSteps(data: StepReorderRequest): Promise<ProjectStep[]> {
    return api.post(API_ENDPOINTS.PROJECTS.STEP_REORDER, data)
  }
}

export const {
  list: getProjectsList,
  create: createProject,
  update: updateProject,
  patch: patchProject,
  delete: deleteProject,
  stepList: getStepList,
  stepDetail: getStepDetail,
  createStep,
  updateStep,
  patchStep,
  deleteStep,
  reorderSteps,
} = ProjectsService
