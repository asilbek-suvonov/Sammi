import { useQuery } from '@tanstack/react-query'
import { getTechnologyList } from '@/service/technology/technology.service'
import type {
  Technology,
  TechnologyListResponse,
  TechnologyQueryParams,
} from '@/service/technology/technology.types'

const toArray = (raw: TechnologyListResponse | Technology[]): Technology[] => {
  if (Array.isArray(raw)) return raw
  return raw.results ?? []
}

export function useTechnologies(params?: TechnologyQueryParams) {
  return useQuery<Technology[], Error>({
    queryKey: ['technologies', params],
    queryFn: async () => toArray(await getTechnologyList(params)),
    staleTime: 30 * 60 * 1000,
  })
}
