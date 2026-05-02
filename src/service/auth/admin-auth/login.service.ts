import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type { LoginRequest, LoginResponse } from './login.type'

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data)
  return res.data
}
