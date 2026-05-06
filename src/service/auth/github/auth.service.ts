import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  GithubAuthRequest,
  GithubAuthResponse
} from './auth.types'


export const githubAuth = async (
  data: GithubAuthRequest
): Promise<GithubAuthResponse> => {
  try {
    const res = await api.post<GithubAuthResponse>(API_ENDPOINTS.AUTH.GITHUB, {
      access_token: data.access_token,
    })
    return res
  } catch (_error) {
    
    const res = await api.post<GithubAuthResponse>(API_ENDPOINTS.AUTH.GITHUB, {
      access_token: data.access_token,
    } as unknown as Record<string, string>)
    return res
  }
}

