export interface EmailPayload {
  email: string
}

export interface SendOtpResponse {
  message: string
  email: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  access: string
  refresh?: string
  id?: number
  email: string
  full_name?: string
  avatar_url?: string | null
  country?: string
  language_code?: string
  is_new_user?: boolean
}