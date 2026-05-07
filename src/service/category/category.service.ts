import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  Category,
  CategoryDetail,
  CategoryListResponse,
  CategoryQueryParams,
  CategoryRequest,
} from './category.types'

export class CategoryService {
  static list(params?: CategoryQueryParams): Promise<CategoryListResponse> {
    return api.get<CategoryListResponse>(API_ENDPOINTS.CATEGORY.LIST, { params })
  }

  static detail(id: number | string): Promise<CategoryDetail> {
    const url = API_ENDPOINTS.CATEGORY.DETAIL.replace(':id', String(id))
    return api.get<CategoryDetail>(url)
  }

  static create(data: CategoryRequest): Promise<Category> {
    return api.post<Category>(API_ENDPOINTS.CATEGORY.CREATE, data)
  }

  static update(id: number | string, data: CategoryRequest): Promise<Category> {
    const url = API_ENDPOINTS.CATEGORY.UPDATE.replace(':id', String(id))
    return api.put<Category>(url, data)
  }

  static patch(id: number | string, data: Partial<CategoryRequest>): Promise<Category> {
    const url = API_ENDPOINTS.CATEGORY.PATCH.replace(':id', String(id))
    return api.patch<Category>(url, data)
  }

  static delete(id: number | string): Promise<void> {
    const url = API_ENDPOINTS.CATEGORY.DELETE.replace(':id', String(id))
    return api.delete(url)
  }
}

export const {
  list: getCategoryList,
  detail: getCategoryDetail,
  create: createCategory,
  update: updateCategory,
  patch: patchCategory,
  delete: deleteCategory,
} = CategoryService

export default CategoryService
