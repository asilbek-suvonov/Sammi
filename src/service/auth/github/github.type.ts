export interface AuthRequest {
  code: string
  redirect_uri?: string
}

export interface UserResponse {
  id: number
  email: string
  full_name: string
  avatar_url: string
  country: string
  language_code: string
  created_at: string
  is_new_user: boolean
}

export interface AuthResponse extends UserResponse {
  access?: string
  refresh?: string
}
