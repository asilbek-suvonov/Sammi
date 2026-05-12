import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type {
  ChangePasswordRequest,
  Profile,
  ProfileUpdateRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './profile.types'

const hasFile = (data: ProfileUpdateRequest): boolean =>
  Object.values(data).some((v) => v instanceof File)

const toFormData = (data: ProfileUpdateRequest): FormData => {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    if (value instanceof File) fd.append(key, value)
    else fd.append(key, String(value))
  }
  return fd
}

export class ProfileService {
  static get(): Promise<Profile> {
    return api.get<Profile>(API_ENDPOINTS.PROFILE.GET)
  }

  static update(data: ProfileUpdateRequest): Promise<Profile> {
    if (hasFile(data)) {
      return api.put<Profile>(API_ENDPOINTS.PROFILE.UPDATE, toFormData(data), {
        headers: { 'Content-Type': undefined },
      })
    }
    return api.put<Profile>(API_ENDPOINTS.PROFILE.UPDATE, data)
  }

  static patch(data: ProfileUpdateRequest): Promise<Profile> {
    if (hasFile(data)) {
      return api.patch<Profile>(API_ENDPOINTS.PROFILE.PATCH, toFormData(data), {
        headers: { 'Content-Type': undefined },
      })
    }
    return api.patch<Profile>(API_ENDPOINTS.PROFILE.PATCH, data)
  }

  static changePassword(data: ChangePasswordRequest): Promise<void> {
    return api.post<void, ChangePasswordRequest>(
      API_ENDPOINTS.PROFILE.CREATE,
      data
    )
  }

  static refresh(refresh: string): Promise<RefreshTokenResponse> {
    return api.post<RefreshTokenResponse, RefreshTokenRequest>(
      API_ENDPOINTS.REFRESH.TOKEN,
      { refresh },
      { silent: true }
    )
  }
}

export const {
  get: getProfile,
  update: updateProfile,
  patch: patchProfile,
  changePassword,
  refresh: refreshAccessToken,
} = ProfileService
