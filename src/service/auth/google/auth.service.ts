import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  GoogleAuthRequest,
  GoogleAuthResponse
} from './auth.types'


export const googleAuth = async (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
  try {
    const res = await api.post<GoogleAuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, {
      token: data.token,
    })
    return res
  } catch (_error) {
    
    const res = await api.post<GoogleAuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, {
      access_token: data.token,
    } as unknown as Record<string, string>)
    return res
  }
}

