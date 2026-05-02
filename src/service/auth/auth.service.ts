import api from '@/api'
import type { GoogleAuthRequest, GoogleAuthResponse } from './auth.types'
import API_ENDPOINTS from '@/endpoints/api_endpoints'

export const googleAuth = async (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
  const response = await api.post<GoogleAuthResponse>(
    API_ENDPOINTS.AUTH.GOOGLE,
    data
  )
  return response.data
}