import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'


const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 30_000)


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

function extractErrorMessage(data: Record<string, unknown>): string {
  if (typeof data.message === 'string') return data.message
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return String(data.non_field_errors[0])
  }
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length > 0) {
      return String(value[0])
    }
  }
  return JSON.stringify(data)
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
    url.includes('/auth/github') ||
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

    const csrfToken = getCSRFToken()
    if (csrfToken) {
      config.headers.set('X-CSRFToken', csrfToken)
    }

    return config
  },
  (error: unknown) => Promise.reject(error)
)


apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (isAxiosError(error)) {
      const status = error.response?.status

      switch (status) {
        case 400: {
          const errorData = error.response?.data as Record<string, unknown>
          const errorMsg = extractErrorMessage(errorData)
          toast.error(errorMsg || "Noto'g'ri so'rov. Ma'lumotlarni tekshiring.")
          break
        }
        case 401:
          useAuthStore.getState().auth.reset()
          toast.error('Sessiya tugadi. Iltimos, qayta kiring.')
          break
        case 403:
          toast.error("Bu amalni bajarish uchun ruxsat yo'q.")
          break
        case 500:
          toast.error("Server xatosi. Keyinroq urinib ko'ring.")
          break
        default:
          if (!error.response) {
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
