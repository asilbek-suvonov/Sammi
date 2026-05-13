import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createModule,
  deleteModule,
  getModuleDetail,
  getModuleList,
  updateModule,
} from '@/service/module/module.service'
import type {
  ModuleDetail,
  ModuleListItem,
  ModuleQueryParams,
  ModuleRequest,
} from '@/service/module/module.types'

export const moduleKeys = {
  all: ['modules'] as const,
  list: (params?: ModuleQueryParams) => [...moduleKeys.all, 'list', params] as const,
  detail: (id: number | string) => [...moduleKeys.all, 'detail', String(id)] as const,
}

// Modullar ro'yxatini olish
export function useModules(params?: ModuleQueryParams) {
  return useQuery<ModuleListItem[], Error>({
    queryKey: moduleKeys.list(params),
    queryFn: async () => {
      const res = await getModuleList(params)
      return res.results
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Modul tafsilotlarini olish
export function useModule(id: number | string | undefined, enabled = true) {
  return useQuery<ModuleDetail, Error>({
    queryKey: moduleKeys.detail(id ?? ''),
    queryFn: () => getModuleDetail(id as number | string),
    enabled: !!id && enabled,
  })
}

// Error toasts are emitted globally by the axios interceptor.

// Modul yaratish
export function useCreateModule() {
  const qc = useQueryClient()
  return useMutation<ModuleDetail, Error, ModuleRequest>({
    mutationFn: createModule,
    onSuccess: () => {
      toast.success('Modul muvaffaqiyatli yaratildi')
      qc.invalidateQueries({ queryKey: moduleKeys.all })
    },
  })
}

// Modulni yangilash
export function useUpdateModule() {
  const qc = useQueryClient()
  return useMutation<
    ModuleDetail,
    Error,
    { id: number | string; data: ModuleRequest }
  >({
    mutationFn: ({ id, data }) => updateModule(id, data),
    onSuccess: (_, vars) => {
      toast.success('Modul yangilandi')
      qc.invalidateQueries({ queryKey: moduleKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: moduleKeys.all })
    },
  })
}

// Modulni o'chirish
export function useDeleteModule() {
  const qc = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationFn: deleteModule,
    onSuccess: () => {
      toast.success("Modul o'chirib tashlandi")
      qc.invalidateQueries({ queryKey: moduleKeys.all })
    },
  })
}