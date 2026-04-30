import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request interceptor: attach token if exists ──────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sammi_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: unwrap data, handle errors ─────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally you can handle 401 / token refresh here later
    return Promise.reject(error)
  }
)

export default api
