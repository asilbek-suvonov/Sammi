import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type { GoogleAuthRequest, GoogleAuthResponse } from './auth.types'

// Some backends accept the Google token under different field names
// (e.g. `token`, `id_token`, `access_token`). Send all common variants
// to improve compatibility and avoid "wrong audience" / payload errors
// when client/server client IDs mismatch during verification.
export const googleAuth = (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> =>
  api.post<GoogleAuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, {
    token: data.token,
    id_token: data.token,
    access_token: data.token,
  })
