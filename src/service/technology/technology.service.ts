import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  Technology,
  TechnologyGrouped,
  TechnologyListResponse,
  TechnologyQueryParams,
  TechnologyRequest,
} from './technology.types'

export class TechnologyService {
  static list(params?: TechnologyQueryParams): Promise<TechnologyListResponse> {
    return api.get<TechnologyListResponse>(API_ENDPOINTS.TECHNOLOGY.LIST, { params })
  }

  static detail(id: number | string): Promise<Technology> {
    const url = API_ENDPOINTS.TECHNOLOGY.DETAIL.replace(':id', String(id))
    return api.get<Technology>(url)
  }

  static grouped(): Promise<TechnologyGrouped[]> {
    return api.get<TechnologyGrouped[]>('/technology/grouped')
  }

  static create(data: TechnologyRequest): Promise<Technology> {
    return api.post<Technology>(API_ENDPOINTS.TECHNOLOGY.CREATE, data)
  }

  static update(id: number | string, data: TechnologyRequest): Promise<Technology> {
    const url = API_ENDPOINTS.TECHNOLOGY.UPDATE.replace(':id', String(id))
    return api.put<Technology>(url, data)
  }

  static patch(id: number | string, data: Partial<TechnologyRequest>): Promise<Technology> {
    const url = API_ENDPOINTS.TECHNOLOGY.PATCH.replace(':id', String(id))
    return api.patch<Technology>(url, data)
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.TECHNOLOGY.DELETE.replace(':id', String(id))
    return api.delete(url)
  }
}

export const {
  list: getTechnologyList,
  detail: getTechnologyDetail,
  grouped: getGroupedTechnologies,
  create: createTechnology,
  update: updateTechnology,
  patch: patchTechnology,
  delete: deleteTechnology,
} = TechnologyService

export default TechnologyService
