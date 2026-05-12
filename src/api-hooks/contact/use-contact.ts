import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ContactService } from '@/service/contact/contact.service'
import type {
  IContactQueryParams,
  ICreateContactRequest,
} from '@/service/contact/contact.type'

export const contactKeys = {
  all: ['contacts'] as const,
  list: (params?: IContactQueryParams) =>
    [...contactKeys.all, 'list', params] as const,
}

export function useContacts(params?: IContactQueryParams) {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => ContactService.get({ ordering: '-created_at', ...params }),
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  })
}

export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ICreateContactRequest) => ContactService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.all })
    },
  })
}
