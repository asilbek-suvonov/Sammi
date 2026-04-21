import { create } from 'zustand'

const ACCESS_TOKEN_KEY = 'sammi_access_token'
const AUTH_USER_KEY = 'sammi_auth_user'

interface AuthUser {
  accountNo: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user'
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY) ?? ''
  const storedUserRaw = localStorage.getItem(AUTH_USER_KEY)
  const storedUser = storedUserRaw ? (JSON.parse(storedUserRaw) as AuthUser) : null

  return {
    auth: {
      user: storedUser,
      setUser: (user) =>
        set((state) => {
          if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
          else localStorage.removeItem(AUTH_USER_KEY)
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: storedToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(AUTH_USER_KEY)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
