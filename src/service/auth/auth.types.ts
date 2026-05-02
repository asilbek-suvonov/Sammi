/** Request body for Google OAuth login */
export interface GoogleAuthRequest {
  token: string
}

/**
 * Backend /auth/google/ response (swagger bo'yicha)
 * 200 = mavjud user, 201 = yangi user
 */
export interface GoogleAuthResponse {
  id: number
  email: string
  full_name: string
  avatar_url: string
  country: string
  language_code: string
  created_at: string
  is_new_user: boolean
  // Agar backend token ham qaytarsa:
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