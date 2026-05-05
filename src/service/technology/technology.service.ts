import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  Technology,
  TechnologyListResponse,
  TechnologyQueryParams,
} from './technology.types'

export class TechnologyService {
  static list(params?: TechnologyQueryParams): Promise<TechnologyListResponse | Technology[]> {
    return api.get<TechnologyListResponse | Technology[]>(API_ENDPOINTS.TECHNOLOGY.LIST, { params })
  }
}

export const { list: getTechnologyList } = TechnologyService

export default TechnologyService
