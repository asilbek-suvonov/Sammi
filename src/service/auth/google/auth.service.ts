import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  GoogleAuthRequest,
  GoogleAuthResponse
} from './auth.types'

// ── Auth Service ──────────────────────────────────────────────

/**
 * Sends a Google OAuth credential token to the backend
 * and receives access + refresh tokens.
 */
export const googleAuth = async (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
  try {
    const res = await api.post<GoogleAuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, {
      token: data.token,
    })
    return res.data
  } catch (_error) {
    // Swagger bo'yicha `token` bo'lishi kerak; ammo eski backend'larda `access_token` bo'lishi mumkin.
    const res = await api.post<GoogleAuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, {
      access_token: data.token,
    } as unknown as Record<string, string>)
    return res.data
  }
}

