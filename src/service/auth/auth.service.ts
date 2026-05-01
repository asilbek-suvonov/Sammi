import api from '@/api'
import { ENDPOINTS } from '@/endpoints'
import type {
  GoogleAuthRequest,
  GoogleAuthResponse,
  LoginRequest,
  LoginResponse,
} from './auth.types'

// ── Auth Service ──────────────────────────────────────────────

/**
 * Sends a Google OAuth credential token to the backend
 * and receives access + refresh tokens.
 */
export const googleAuth = async (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
  // Prefer `access_token` (common backend expectation); keep `token` fallback.
  if (data.access_token) {
    try {
      const res = await api.post<GoogleAuthResponse>(ENDPOINTS.AUTH.GOOGLE, {
        access_token: data.access_token,
      })
      return res.data
    } catch (_error) {
      // Some backends still expect `token` instead of `access_token`.
      const res = await api.post<GoogleAuthResponse>(ENDPOINTS.AUTH.GOOGLE, {
        token: data.token ?? data.access_token,
      })
      return res.data
    }
  }

  const res = await api.post<GoogleAuthResponse>(ENDPOINTS.AUTH.GOOGLE, {
    token: data.token ?? '',
  })
  return res.data
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, data)
  return res.data
}
