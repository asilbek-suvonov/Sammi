import api from '@/api'
import { ENDPOINTS } from '@/endpoints/api_endpoints'
import type { GoogleAuthRequest, GoogleAuthResponse } from './auth.types'

// ── Auth Service ──────────────────────────────────────────────

/**
 * Sends a Google OAuth credential token to the backend
 * and receives access + refresh tokens.
 */
export const googleAuth = async (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
  const response = await api.post<GoogleAuthResponse>(
    ENDPOINTS.AUTH.AUTH_GOOGLE,
    data
  )
  return response.data
}
