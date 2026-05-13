import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getSourcesList,
  getSourceBySlug,
  createSource,
  updateSource,
  patchSource,
  deleteSource,
} from '@/service/sources/sources.service'
import type {
  SourceCode,
  SourceCodeCreateUpdate,
  SourceCodePartialUpdate,
  SourceCodeQueryParams,
  SourceCodeListResponse,
} from '@/service/sources/sources.type'

// Error toasts are emitted globally by the axios interceptor.

const SOURCES_QUERY_KEY = 'sources'
const SOURCE_DETAIL_QUERY_KEY = 'source'

export function useSources(params?: SourceCodeQueryParams) {
  return useQuery<SourceCodeListResponse, Error>({
    queryKey: [SOURCES_QUERY_KEY, params],
    queryFn: () => getSourcesList(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSource(slug: string, enabled = true) {
  return useQuery<SourceCode, Error>({
    queryKey: [SOURCE_DETAIL_QUERY_KEY, slug],
    queryFn: () => getSourceBySlug(slug),
    enabled: !!slug && enabled,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCreateSource() {
  const queryClient = useQueryClient()
  return useMutation<SourceCode, Error, SourceCodeCreateUpdate>({
    mutationFn: createSource,
    onSuccess: () => {
      toast.success('Source code created successfully')
      queryClient.invalidateQueries({ queryKey: [SOURCES_QUERY_KEY] })
    },
  })
}

export function useUpdateSource() {
  const queryClient = useQueryClient()
  return useMutation<
    SourceCode,
    Error,
    { slug: string; data: SourceCodeCreateUpdate }
  >({
    mutationFn: ({ slug, data }) => updateSource(slug, data),
    onSuccess: (_, variables) => {
      toast.success('Source code updated successfully')
      queryClient.invalidateQueries({
        queryKey: [SOURCE_DETAIL_QUERY_KEY, variables.slug],
      })
      queryClient.invalidateQueries({ queryKey: [SOURCES_QUERY_KEY] })
    },
  })
}

export function usePatchSource() {
  const queryClient = useQueryClient()
  return useMutation<
    SourceCode,
    Error,
    { slug: string; data: SourceCodePartialUpdate }
  >({
    mutationFn: ({ slug, data }) => patchSource(slug, data),
    onSuccess: (_, variables) => {
      toast.success('Source code updated successfully')
      queryClient.invalidateQueries({
        queryKey: [SOURCE_DETAIL_QUERY_KEY, variables.slug],
      })
      queryClient.invalidateQueries({ queryKey: [SOURCES_QUERY_KEY] })
    },
  })
}

export function useDeleteSource() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteSource,
    onSuccess: () => {
      toast.success('Source code deleted successfully')
      queryClient.invalidateQueries({ queryKey: [SOURCES_QUERY_KEY] })
    },
  })
}

export const sourcesHooks = {
  useSources,
  useSource,
  useCreateSource,
  useUpdateSource,
  usePatchSource,
  useDeleteSource,
}
