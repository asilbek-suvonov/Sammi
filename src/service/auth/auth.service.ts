import api from '@/api'
import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type { GoogleAuthRequest, GoogleAuthResponse } from './auth.types'
import { GithubAuthRequest, GithubAuthResponse } from './github/auth.types'

export const googleAuth= (
  data: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
  const response = api.post<GoogleAuthResponse>(
    API_ENDPOINTS.AUTH.GOOGLE,
    data
  )
  return response
}

export const githubAuth = async (data: GithubAuthRequest): Promise<GithubAuthResponse> => {
  return await api.post<GithubAuthResponse>(API_ENDPOINTS.AUTH.GITHUB, data);
};