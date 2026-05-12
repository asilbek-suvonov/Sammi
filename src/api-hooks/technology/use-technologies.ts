import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createTechnology,
  deleteTechnology,
  getGroupedTechnologies,
  getTechnologyDetail,
  getTechnologyList,
  patchTechnology,
  updateTechnology,
} from '@/service/technology/technology.service'
import type {
  Technology,
  TechnologyGrouped,
  TechnologyListResponse,
  TechnologyQueryParams,
  TechnologyRequest,
} from '@/service/technology/technology.types'

export const technologyKeys = {
  all: ['technologies'] as const,
  list: (params?: TechnologyQueryParams) => [...technologyKeys.all, 'list', params] as const,
  detail: (id: number | string) => [...technologyKeys.all, 'detail', String(id)] as const,
  grouped: () => [...technologyKeys.all, 'grouped'] as const,
}

export function useTechnologies(params?: TechnologyQueryParams) {
  return useQuery<Technology[], Error>({
    queryKey: technologyKeys.list(params),
    queryFn: async () => {
      const res = await getTechnologyList(params)
      return res.results
    },
    staleTime: 30 * 60 * 1000,
  })
}

export function useTechnologiesPaginated(params?: TechnologyQueryParams) {
  return useQuery<TechnologyListResponse, Error>({
    queryKey: technologyKeys.list(params),
    queryFn: () => getTechnologyList(params),
    staleTime: 30 * 60 * 1000,
  })
}

export function useTechnology(id: number | string | undefined, enabled = true) {
  return useQuery<Technology, Error>({
    queryKey: technologyKeys.detail(id ?? ''),
    queryFn: () => getTechnologyDetail(id as number | string),
    enabled: !!id && enabled,
    staleTime: 30 * 60 * 1000,
  })
}

export function useGroupedTechnologies() {
  return useQuery<TechnologyGrouped[], Error>({
    queryKey: technologyKeys.grouped(),
    queryFn: getGroupedTechnologies,
    staleTime: 30 * 60 * 1000,
  })
}

export function useCreateTechnology() {
  const qc = useQueryClient()
  return useMutation<Technology, Error, TechnologyRequest>({
    mutationFn: createTechnology,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: technologyKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create technology')
    },
  })
}

export function useUpdateTechnology() {
  const qc = useQueryClient()
  return useMutation<Technology, Error, { id: number | string; data: TechnologyRequest }>({
    mutationFn: ({ id, data }) => updateTechnology(id, data),
    onSuccess: (_, vars) => {
      toast.success('Technology updated successfully')
      qc.invalidateQueries({ queryKey: technologyKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: technologyKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update technology')
    },
  })
}

export function usePatchTechnology() {
  const qc = useQueryClient()
  return useMutation<
    Technology,
    Error,
    { id: number | string; data: Partial<TechnologyRequest> }
  >({
    mutationFn: ({ id, data }) => patchTechnology(id, data),
    onSuccess: (_, vars) => {
      toast.success('Technology updated successfully')
      qc.invalidateQueries({ queryKey: technologyKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: technologyKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update technology')
    },
  })
}

export function useDeleteTechnology() {
  const qc = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationFn: deleteTechnology,
    onSuccess: () => {
      toast.success('Technology deleted successfully')
      qc.invalidateQueries({ queryKey: technologyKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete technology')
    },
  })
}
