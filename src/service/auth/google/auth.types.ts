
export interface GoogleAuthRequest {
  token: string
}

export interface GoogleAuthResponse {
  access: string
  refresh: string
  user: GoogleAuthUser
}

export interface GoogleAuthUser {
  email: string
  is_staff: boolean
  account_no: string
  first_name: string
  last_name: string
  exp: number
  is_admin?: boolean
}
