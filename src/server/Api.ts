import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface ApiErrorPayload {
  message?: string
  title?: string
  code?: string | number
  errors?: Record<string, string[]>
  [key: string]: unknown
}

/** Normalized error thrown by every ApiClient method. */
export class ApiError extends Error {
  readonly success = false as const
  readonly status: number
  readonly code?: string | number
  readonly data: ApiErrorPayload | null
  readonly isNetworkError: boolean
  readonly isCancel: boolean

  constructor(init: {
    status: number
    message: string
    data?: ApiErrorPayload | null
    code?: string | number
    isNetworkError?: boolean
    isCancel?: boolean
  }) {
    super(init.message)
    this.name = 'ApiError'
    this.status = init.status
    this.code = init.code
    this.data = init.data ?? null
    this.isNetworkError = init.isNetworkError ?? false
    this.isCancel = init.isCancel ?? false
  }
}

export interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
  /** Skip attaching the Bearer token. Useful for public endpoints (OTP send, OAuth). */
  skipAuth?: boolean
  /** Skip the global 401 → refresh flow. Used by the refresh call itself. */
  skipAuthRefresh?: boolean
  /** Suppress error toasts for this call (e.g. login form handles its own errors). */
  silent?: boolean
}

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  skipAuth?: boolean
  skipAuthRefresh?: boolean
  silent?: boolean
}

export type OAuthProvider = 'google' | 'github'

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

/* -------------------------------------------------------------------------- */
/*                                    Config                                  */
/* -------------------------------------------------------------------------- */

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ||
  '/api'

const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30_000
const ADMIN_LOGIN_ROUTE = '/admin-login'

/* -------------------------------------------------------------------------- */
/*                          Refresh-token coordination                        */
/* -------------------------------------------------------------------------- */

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  // Single-flight: collapse concurrent 401s into one refresh request.
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const { data } = await axios.post<AuthTokens>(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true, timeout: DEFAULT_TIMEOUT }
    )
    useAuthStore.getState().auth.setAccessToken(data.accessToken)
    return data.accessToken
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

/** Role-aware unauthenticated handler — modal for users, redirect for admins. */
function handleUnauthenticated(): void {
  const { auth } = useAuthStore.getState()
  const role = auth.user?.role
  auth.reset()

  if (role === 'admin') {
    if (typeof window !== 'undefined' && window.location.pathname !== ADMIN_LOGIN_ROUTE) {
      window.location.href = ADMIN_LOGIN_ROUTE
    }
  } else {
    auth.openLoginModal()
  }
}

/* -------------------------------------------------------------------------- */
/*                                Axios client                                */
/* -------------------------------------------------------------------------- */

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // ---- Request: attach Bearer token, fix Content-Type for FormData -------
    this.client.interceptors.request.use(
      (config) => {
        const cfg = config as RetryableConfig

        if (!cfg.skipAuth) {
          const token = useAuthStore.getState().auth.accessToken
          if (token) {
            cfg.headers = cfg.headers ?? {}
            ;(cfg.headers as Record<string, string>).Authorization = `Bearer ${token}`
          }
        }

        // Let the browser set the multipart boundary for FormData.
        if (typeof FormData !== 'undefined' && cfg.data instanceof FormData) {
          if (cfg.headers && 'Content-Type' in cfg.headers) {
            delete (cfg.headers as Record<string, unknown>)['Content-Type']
          }
        }

        return cfg
      },
      (error: unknown) => Promise.reject(error)
    )

    // ---- Response: refresh on 401, normalize errors ------------------------
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ApiErrorPayload>) => {
        if (axios.isCancel(error)) {
          return Promise.reject(
            new ApiError({ status: 0, message: 'Request cancelled', isCancel: true })
          )
        }

        const original = error.config as RetryableConfig | undefined

        // No response → network/timeout failure
        if (!error.response) {
          const message =
            error.code === 'ECONNABORTED'
              ? 'Server timeout — please try again'
              : 'Network error — check your connection'
          if (!original?.silent) toast.error(message)
          return Promise.reject(
            new ApiError({ status: 0, message, code: error.code, isNetworkError: true })
          )
        }

        const { status, data } = error.response

        // ---- 401: refresh + retry; on failure, role-aware logout -----------
        if (
          status === 401 &&
          original &&
          !original._retry &&
          !original.skipAuth &&
          !original.skipAuthRefresh
        ) {
          original._retry = true
          try {
            const newToken = await refreshAccessToken()
            original.headers = original.headers ?? {}
            ;(original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`
            return this.client(original)
          } catch {
            handleUnauthenticated()
          }
        } else if (status === 401 && !original?.skipAuth) {
          handleUnauthenticated()
        }

        // ---- 5xx: server-side failure --------------------------------------
        if (status >= 500 && !original?.silent) {
          toast.error('Server error — please try again later')
        }

        const message =
          data?.message ?? data?.title ?? error.message ?? 'Something went wrong'

        return Promise.reject(
          new ApiError({ status, message, data: data ?? null, code: data?.code })
        )
      }
    )
  }

  /* ------------------------------- HTTP verbs ----------------------------- */

  request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.client(config).then((res: AxiosResponse<T>) => res.data)
  }

  get<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ ...options, method: 'GET', url })
  }

  post<T = unknown, B = unknown>(url: string, data?: B, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ ...options, method: 'POST', url, data })
  }

  put<T = unknown, B = unknown>(url: string, data?: B, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ ...options, method: 'PUT', url, data })
  }

  patch<T = unknown, B = unknown>(url: string, data?: B, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ ...options, method: 'PATCH', url, data })
  }

  delete<T = unknown, B = unknown>(
    url: string,
    options: RequestOptions & { data?: B } = {}
  ): Promise<T> {
    const { data, ...rest } = options
    return this.request<T>({ ...rest, method: 'DELETE', url, data })
  }

  /* ----------------------------- File helpers ----------------------------- */

  upload<T = unknown>(
    url: string,
    file: File | Blob | FormData,
    extra: Record<string, string | Blob> = {},
    options: RequestOptions = {}
  ): Promise<T> {
    const form = file instanceof FormData ? file : new FormData()
    if (!(file instanceof FormData)) form.append('file', file)
    for (const [key, value] of Object.entries(extra)) form.append(key, value)
    return this.request<T>({ ...options, method: 'POST', url, data: form })
  }

  async download(url: string, options: RequestOptions = {}): Promise<Blob> {
    const response = await this.client.request<Blob>({
      ...options,
      method: 'GET',
      url,
      responseType: 'blob',
    })
    return response.data
  }

  isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError
  }
}

export const apiClient = new ApiClient()
export default apiClient

/* -------------------------------------------------------------------------- */
/*                              Auth helper API                               */
/* -------------------------------------------------------------------------- */

export const authApi = {
  /** Send a one-time code to the user's email. Public endpoint. */
  sendOtp: (email: string) =>
    apiClient.post<{ success: boolean }>(
      '/auth/otp/send',
      { email },
      { skipAuth: true, silent: true }
    ),

  /** Verify the OTP and receive an access token. Public endpoint. */
  verifyOtp: (email: string, code: string) =>
    apiClient.post<AuthTokens>(
      '/auth/otp/verify',
      { email, code },
      { skipAuth: true, silent: true }
    ),

  /** Trigger backend-driven OAuth redirect (Google / GitHub). */
  loginWithOAuth: (provider: OAuthProvider, redirectAfter: string = window.location.pathname) => {
    const url = new URL(`${BASE_URL}/auth/${provider}`)
    url.searchParams.set('redirect', redirectAfter)
    window.location.href = url.toString()
  },

  /** Admin-only credentials login. */
  adminLogin: (email: string, password: string) =>
    apiClient.post<AuthTokens>(
      '/auth/admin/login',
      { email, password },
      { skipAuth: true, silent: true }
    ),

  /** Invalidate session on the server and locally. */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout', {}, { silent: true })
    } finally {
      useAuthStore.getState().auth.reset()
    }
  },

  /** Get the currently authenticated user (call after login or on app boot). */
  me: <T = unknown>() => apiClient.get<T>('/auth/me'),
}
