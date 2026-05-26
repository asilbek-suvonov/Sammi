import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

// Allow callers to suppress the global error toast for expected API errors
// (e.g. 403 = "already enrolled", 400 = "progress already exists")
declare module 'axios' {
  interface AxiosRequestConfig {
    silent?: boolean
    _retry?: boolean
  }
}


const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 30_000)
const API_REFRESH_PATH = '/refresh/'


export interface ApiError {
  message: string
  status: number
  data?: unknown
}


function getCSRFToken(): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1]
}

// Never let a credential-looking string ride to the toast UI. Backend error
// payloads occasionally echo back the offending token (e.g. JWT validation
// failures, OAuth state mismatches) — strip those before showing.
const SENSITIVE_KEYS = /^(token|access|refresh|password|new_password|current_password|confirm_password|secret|credential|otp|code)$/i
const JWT_PATTERN = /\beyJ[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+\b/g
const LONG_OPAQUE_TOKEN = /\b[A-Za-z0-9_-]{40,}\b/g

function sanitizeToastText(raw: string): string {
  return raw
    .replace(JWT_PATTERN, '[redacted]')
    .replace(LONG_OPAQUE_TOKEN, '[redacted]')
    .trim()
}

function pickFirstString(data: Record<string, unknown>): string | undefined {
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.test(key)) continue
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      return value[0]
    }
  }
  return undefined
}

function extractErrorMessage(data: Record<string, unknown>): string {
  const candidate =
    (typeof data.message === 'string' && data.message) ||
    (typeof data.detail === 'string' && data.detail) ||
    (Array.isArray(data.non_field_errors) &&
      data.non_field_errors.length > 0 &&
      String(data.non_field_errors[0])) ||
    pickFirstString(data) ||
    ''
  return candidate ? sanitizeToastText(candidate) : ''
}


export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})


const isPublicAuthEndpoint = (url?: string) => {
  if (!url) return false
  return (
    url.includes('/auth/google') ||
    url.includes('/login') ||
    url.includes('/send-otp') ||
    url.includes('/verify-otp')
  )
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState().auth

    if (accessToken && !isPublicAuthEndpoint(config.url)) {
      config.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    // FormData uploads need `multipart/form-data; boundary=...` which the
    // browser sets automatically. The default `application/json` would
    // override that and the backend returns 415 — drop it for FormData.
    if (config.data instanceof FormData) {
      config.headers.delete('Content-Type')
    }

    const csrfToken = getCSRFToken()
    if (csrfToken) {
      config.headers.set('X-CSRFToken', csrfToken)
    }

    return config
  },
  (error: unknown) => Promise.reject(error)
)


let refreshPromise: Promise<string | null> | null = null

async function tryRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise
  const { refreshToken, setAccessToken } = useAuthStore.getState().auth
  if (!refreshToken) return null
  refreshPromise = axios
    .post<{ access: string; refresh?: string }>(
      `${baseURL}${API_REFRESH_PATH}`,
      { refresh: refreshToken },
      { withCredentials: true, timeout }
    )
    .then((res) => {
      const newAccess = res.data?.access
      if (!newAccess) return null
      setAccessToken(newAccess)
      return newAccess
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (isAxiosError(error)) {
      const status = error.response?.status

      const silent = error.config?.silent ?? false

      if (status === 401 && error.config && !error.config._retry) {
        const isRefreshCall = error.config.url?.includes(API_REFRESH_PATH)
        if (!isRefreshCall) {
          const newAccess = await tryRefresh()
          if (newAccess) {
            error.config._retry = true
            error.config.headers = error.config.headers ?? {}
            ;(error.config.headers as Record<string, string>).Authorization =
              `Bearer ${newAccess}`
            return apiClient.request(error.config)
          }
        }
      }

      switch (status) {
        case 400: {
          if (!silent) {
            const errorData = error.response?.data as Record<string, unknown>
            const errorMsg = extractErrorMessage(errorData)
            toast.error(errorMsg || "Noto'g'ri so'rov. Ma'lumotlarni tekshiring.")
          }
          break
        }
        case 401: {
          // Only treat 401 as "session expired" if we actually had a token.
          // For sessions without a JWT (e.g. Google users — backend returns
          // user object only), a 401 just means the endpoint requires auth
          // we don't have. Resetting would log them out of UI state too.
          const hadToken = useAuthStore.getState().auth.accessToken
          if (hadToken) {
            useAuthStore.getState().auth.reset()
            if (!silent) toast.error('Sessiya tugadi. Iltimos, qayta kiring.')
          }
          break
        }
        case 403:
          if (!silent) {
            toast.error("Bu amalni bajarish uchun ruxsat yo'q.")
          }
          break
        case 500:
          if (!silent) {
            toast.error("Server xatosi. Keyinroq urinib ko'ring.")
          }
          break
        default:
          if (!error.response && !silent) {
            toast.error("Internet bilan bog'lanishda muammo yuz berdi.")
          }
      }

      const dataMessage = (error.response?.data as Record<string, string>)?.message
      const errorMessage = error.message
      const fallbackMessage = 'Unknown error occurred'

      const apiError: ApiError = {
        message: dataMessage || errorMessage || fallbackMessage,
        status: status ?? 0,
        data: error.response?.data,
      }

      return Promise.reject(apiError)
    }

    const fallbackError: ApiError = {
      message: error instanceof Error ? error.message : 'Network error occurred',
      status: 0,
      data: null,
    }
    return Promise.reject(fallbackError)
  }
)


const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = void>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(url, config).then((res) => res.data),
}

export default api
