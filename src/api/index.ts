import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 30000)

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState().auth

    if (accessToken) {
      config.headers = config.headers ?? {}
      if (typeof (config.headers as { set?: unknown }).set === 'function') {
        ;(config.headers as { set: (key: string, value: string) => void }).set(
          'Authorization',
          `Bearer ${accessToken}`
        )
      } else {
        ;(config.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient
