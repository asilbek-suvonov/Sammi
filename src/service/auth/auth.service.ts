import api from '@/api'
import { ENDPOINTS } from '@/endpoints/api_endpoints'
import type { GoogleAuthRequest, GoogleAuthResponse } from './auth.types'

export const googleAuth = async (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
  const response = await api.post<GoogleAuthResponse>(
    ENDPOINTS.AUTH.AUTH_GOOGLE,
    data
  )
  return response.data
}