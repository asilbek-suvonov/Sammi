// ── Auth Service Types ────────────────────────────────────────

/** Request body for Google OAuth login */
export interface GoogleAuthRequest {
  /**
   * Most backends (Django dj-rest-auth / allauth style) expect `access_token`.
   * Keep `token` as a fallback for older implementations.
   */
  access_token?: string
  token?: string
}

/** Response from the auth/google endpoint */
export interface GoogleAuthResponse {
  access: string
  refresh: string
}

/** Response from the standard login endpoint */
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
}
