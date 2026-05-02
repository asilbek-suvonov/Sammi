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
    const response = await api.get<SourceCodeListResponse>(
      API_ENDPOINTS.SOURCE_CODES.LIST,
      { params }
    )
    return response.data
  }


  static async getBySlug(slug: string): Promise<SourceCode> {
    const url = API_ENDPOINTS.SOURCE_CODES.DETAIL.replace(':slug', slug)
    const response = await api.get<SourceCode>(url)
    return response.data
  }


  static async create(data: SourceCodeCreateUpdate): Promise<SourceCode> {
    const response = await api.post<SourceCode>(
      API_ENDPOINTS.SOURCE_CODES.CREATE,
      data
    )
    return response.data
  }


  static async update(slug: string, data: SourceCodeCreateUpdate): Promise<SourceCode> {
    const url = API_ENDPOINTS.SOURCE_CODES.UPDATE.replace(':slug', slug)
    const response = await api.put<SourceCode>(url, data)
    return response.data
  }


  static async patch(slug: string, data: SourceCodePartialUpdate): Promise<SourceCode> {
    const url = API_ENDPOINTS.SOURCE_CODES.PATCH.replace(':slug', slug)
    const response = await api.patch<SourceCode>(url, data)
    return response.data
  }


  static async delete(slug: string): Promise<void> {
    const url = API_ENDPOINTS.SOURCE_CODES.DELETE.replace(':slug', slug)
    await api.delete(url)
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
