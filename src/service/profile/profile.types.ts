export interface Profile {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  nickname: string
  bio: string
  avatar_url: string | null
  created_at?: string
  updated_at?: string
}

export interface ProfileUpdateRequest {
  username?: string
  first_name?: string
  last_name?: string
  nickname?: string
  bio?: string
  avatar?: File | null
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password?: string
}

export interface RefreshTokenRequest {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
  refresh?: string
}
