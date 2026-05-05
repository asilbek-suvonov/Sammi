/** Optional backend exchange — frontend sends Google access_token,
 *  backend verifies it with Google and returns the app's own JWT. */
export interface GoogleAuthRequest {
  access_token: string
}

export interface GoogleAuthResponse {
  id: number
  email: string
  full_name: string
  avatar_url: string
  country: string
  language_code: string
  created_at: string
  is_new_user: boolean
  access?: string
  refresh?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
}
