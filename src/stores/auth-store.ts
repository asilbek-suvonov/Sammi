import { create } from 'zustand'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

const ACCESS_TOKEN_KEY = 'sammi_access_token'
const REFRESH_TOKEN_KEY = 'sammi_refresh_token'
const AUTH_USER_KEY = 'sammi_auth_user'

// Older builds persisted these keys in localStorage. Migrate any leftover
// values to cookies once, then strip them out so the JS heap stops carrying
// the secrets.
const LEGACY_LS_KEYS = [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, AUTH_USER_KEY] as const

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

function migrateLegacy(): void {
  if (!isBrowser) return
  try {
    for (const key of LEGACY_LS_KEYS) {
      const legacy = localStorage.getItem(key)
      if (legacy && !getCookie(key)) setCookie(key, legacy)
      if (legacy) localStorage.removeItem(key)
    }
  } catch {
    /* localStorage may be disabled; nothing to migrate */
  }
}

migrateLegacy()

const readString = (key: string): string => getCookie(key) ?? ''

const readUser = (): AuthUser | null => {
  const raw = getCookie(AUTH_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

const writeString = (key: string, value: string) => {
  if (value) setCookie(key, value)
  else removeCookie(key)
}

const writeUser = (user: AuthUser | null) => {
  if (user) setCookie(AUTH_USER_KEY, JSON.stringify(user))
  else removeCookie(AUTH_USER_KEY)
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
