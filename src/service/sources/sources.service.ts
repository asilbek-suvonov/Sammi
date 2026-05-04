import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  SourceCode,
  SourceCodeCreateUpdate,
  SourceCodePartialUpdate,
  SourceCodeListResponse,
  SourceCodeQueryParams,
} from './sources.type'

export class SourcesService {

  static async list(params?: SourceCodeQueryParams): Promise<SourceCodeListResponse> {
    return api.get<SourceCodeListResponse>(API_ENDPOINTS.SOURCE_CODES.LIST, { params })
  }

  static async getBySlug(slug: string): Promise<SourceCode> {
    const url = API_ENDPOINTS.SOURCE_CODES.DETAIL.replace(':slug', slug)
    return api.get<SourceCode>(url)
  }

  static async create(data: SourceCodeCreateUpdate): Promise<SourceCode> {
    return api.post<SourceCode>(API_ENDPOINTS.SOURCE_CODES.CREATE, data)
  }

  static async update(slug: string, data: SourceCodeCreateUpdate): Promise<SourceCode> {
    const url = API_ENDPOINTS.SOURCE_CODES.UPDATE.replace(':slug', slug)
    return api.put<SourceCode>(url, data)
  }

  static async patch(slug: string, data: SourceCodePartialUpdate): Promise<SourceCode> {
    const url = API_ENDPOINTS.SOURCE_CODES.PATCH.replace(':slug', slug)
    return api.patch<SourceCode>(url, data)
  }

  static async delete(slug: string): Promise<void> {
    const url = API_ENDPOINTS.SOURCE_CODES.DELETE.replace(':slug', slug)
    return api.delete(url)
  }
}

export const {
  list: getSourcesList,
  getBySlug: getSourceBySlug,
  create: createSource,
  update: updateSource,
  patch: patchSource,
  delete: deleteSource,
} = SourcesService

export default SourcesService
