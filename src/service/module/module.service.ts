import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  ModuleDetail,
  ModuleListResponse,
  ModuleQueryParams,
  ModuleRequest,
} from './module.types'

export class ModuleService {
  static list(params?: ModuleQueryParams): Promise<ModuleListResponse> {
    return api.get<ModuleListResponse>(API_ENDPOINTS.MODULES.LIST, { params })
  }

  static detail(id: number | string): Promise<ModuleDetail> {
    const url = API_ENDPOINTS.MODULES.DETAIL.replace(':id', String(id))
    return api.get<ModuleDetail>(url)
  }

  static create(data: ModuleRequest): Promise<ModuleDetail> {
    return api.post<ModuleDetail>(API_ENDPOINTS.MODULES.CREATE, data)
  }

  static update(id: number | string, data: ModuleRequest): Promise<ModuleDetail> {
    const url = API_ENDPOINTS.MODULES.UPDATE.replace(':id', String(id))
    return api.put<ModuleDetail>(url, data)
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.MODULES.DELETE.replace(':id', String(id))
    return api.delete(url)
  }
}

export const {
  list: getModuleList,
  detail: getModuleDetail,
  create: createModule,
  update: updateModule,
  delete: deleteModule,
} = ModuleService

export default ModuleService