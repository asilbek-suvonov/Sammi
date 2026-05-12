import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type {
  IContactListResponse,
  IContactQueryParams,
  ICreateContactRequest,
} from './contact.type'

export class ContactService {
  static get(params?: IContactQueryParams): Promise<IContactListResponse> {
    return api.get<IContactListResponse>(API_ENDPOINTS.CONTACT.LIST, { params })
  }

  static create(data: ICreateContactRequest): Promise<void> {
    return api.post<void, ICreateContactRequest>(
      API_ENDPOINTS.CONTACT.CREATE,
      data,
    )
  }
}

export const {
  get: getContacts,
  create: createContact,
} = ContactService

export default ContactService
