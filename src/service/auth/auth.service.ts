import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type { GoogleAuthRequest, GoogleAuthResponse } from './auth.types'

export const googleAuth = (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> =>
  api.post<GoogleAuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, data)
