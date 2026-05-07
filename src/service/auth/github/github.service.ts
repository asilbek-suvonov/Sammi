import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type { AuthRequest, AuthResponse } from './github.type'

export const githubAuth = ({ code }: AuthRequest): Promise<AuthResponse> =>
  api.post<AuthResponse>(API_ENDPOINTS.AUTH.GITHUB, { code })
