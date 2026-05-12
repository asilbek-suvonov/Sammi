import { create } from 'zustand'

const ACCESS_TOKEN_KEY = 'sammi_access_token'
const REFRESH_TOKEN_KEY = 'sammi_refresh_token'
const AUTH_USER_KEY = 'sammi_auth_user'

export interface AuthUser {
  id?: number
  accountNo?: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  avatarUrl?: string
  country?: string
  languageCode?: string
  isNewUser?: boolean
  avatar_url?: string
  isStaff?: boolean
  role: 'admin' | 'user'
  exp?: number
}

export interface LoginPayload {
  accessToken: string
  refreshToken?: string
  user?: AuthUser | null
}

interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: string
    refreshToken: string
    loginModalOpen: boolean

    setUser: (user: AuthUser | null) => void
    setAccessToken: (accessToken: string) => void
    setRefreshToken: (refreshToken: string) => void
    resetAccessToken: () => void
    login: (payload: LoginPayload) => void
    reset: () => void

    openLoginModal: () => void
    closeLoginModal: () => void
  }
}

const isBrowser = typeof window !== 'undefined'

const readString = (key: string): string => {
  if (!isBrowser) return ''
  try {
    return localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

const readUser = (): AuthUser | null => {
  if (!isBrowser) return null
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

const writeString = (key: string, value: string) => {
  if (!isBrowser) return
  if (value) localStorage.setItem(key, value)
  else localStorage.removeItem(key)
}

const writeUser = (user: AuthUser | null) => {
  if (!isBrowser) return
  if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(AUTH_USER_KEY)
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {
    user: readUser(),
    accessToken: readString(ACCESS_TOKEN_KEY),
    refreshToken: readString(REFRESH_TOKEN_KEY),
    loginModalOpen: false,

    setUser: (user) =>
      set((state) => {
        writeUser(user)
        return { auth: { ...state.auth, user } }
      }),

    setAccessToken: (accessToken) =>
      set((state) => {
        writeString(ACCESS_TOKEN_KEY, accessToken)
        return { auth: { ...state.auth, accessToken } }
      }),

    setRefreshToken: (refreshToken) =>
      set((state) => {
        writeString(REFRESH_TOKEN_KEY, refreshToken)
        return { auth: { ...state.auth, refreshToken } }
      }),

    resetAccessToken: () =>
      set((state) => {
        writeString(ACCESS_TOKEN_KEY, '')
        return { auth: { ...state.auth, accessToken: '' } }
      }),

    login: ({ accessToken, refreshToken = '', user = null }) =>
      set((state) => {
        writeString(ACCESS_TOKEN_KEY, accessToken)
        writeString(REFRESH_TOKEN_KEY, refreshToken)
        writeUser(user)
        return {
          auth: {
            ...state.auth,
            accessToken,
            refreshToken,
            user,
          },
        }
      }),

    reset: () =>
      set((state) => {
        writeString(ACCESS_TOKEN_KEY, '')
        writeString(REFRESH_TOKEN_KEY, '')
        writeUser(null)
        return {
          auth: {
            ...state.auth,
            accessToken: '',
            refreshToken: '',
            user: null,
          },
        }
      }),

    openLoginModal: () =>
      set((state) => ({ auth: { ...state.auth, loginModalOpen: true } })),
    closeLoginModal: () =>
      set((state) => ({ auth: { ...state.auth, loginModalOpen: false } })),
  },
}))
