import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCategory,
  deleteCategory,
  getCategoryDetail,
  getCategoryList,
  patchCategory,
  updateCategory,
} from '@/service/category/category.service'
import type {
  Category,
  CategoryDetail,
  CategoryListResponse,
  CategoryQueryParams,
  CategoryRequest,
} from '@/service/category/category.types'

// Error toasts are emitted globally by the axios interceptor — no per-hook
// onError needed.

export const categoryKeys = {
  all: ['categories'] as const,
  list: (params?: CategoryQueryParams) => [...categoryKeys.all, 'list', params] as const,
  detail: (id: number | string) => [...categoryKeys.all, 'detail', String(id)] as const,
}

export function useCategories(params?: CategoryQueryParams) {
  return useQuery<CategoryListResponse, Error>({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategoryList(params),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCategory(id: number | string | undefined, enabled = true) {
  return useQuery<CategoryDetail, Error>({
    queryKey: categoryKeys.detail(id ?? ''),
    queryFn: () => getCategoryDetail(id as number | string),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation<Category, Error, CategoryRequest>({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation<Category, Error, { id: number | string; data: CategoryRequest }>({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: (_, vars) => {
      toast.success('Category updated successfully')
      qc.invalidateQueries({ queryKey: categoryKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export function usePatchCategory() {
  const qc = useQueryClient()
  return useMutation<
    Category,
    Error,
    { id: number | string; data: Partial<CategoryRequest> }
  >({
    mutationFn: ({ id, data }) => patchCategory(id, data),
    onSuccess: (_, vars) => {
      toast.success('Category updated successfully')
      qc.invalidateQueries({ queryKey: categoryKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted successfully')
      qc.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}
