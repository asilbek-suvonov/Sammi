import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useAuthStore } from '@/stores/auth-store'
import { DirectionProvider } from './context/direction-provider'
import { FontProvider } from './context/font-provider'
import { ThemeProvider } from './context/theme-provider'
import { routeTree } from './routeTree.gen'
import './styles/index.css'
import "./i18n/i18n"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (!GOOGLE_CLIENT_ID) {
  throw new Error(
    'VITE_GOOGLE_CLIENT_ID is not defined. Please create a .env file and add your Google OAuth Client ID:\n' +
    'VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here'
  )
}

// Single source of truth for error toasts: the axios interceptor in
// `src/api/index.ts` already toasts a server-extracted message for every
// failed response. The query client only handles SIDE EFFECTS here
// (session reset, navigation) — it must NOT toast, otherwise users see
// duplicate notifications (interceptor + onError + per-hook onError).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // No retries in dev — surface real failures immediately.
        if (import.meta.env.DEV) return false
        // Never retry auth errors — they won't resolve on retry and would
        // just amplify server load.
        if (
          error instanceof AxiosError &&
          [400, 401, 403, 404].includes(error.response?.status ?? 0)
        ) {
          return false
        }
        // One retry in prod for transient 5xx / network blips.
        return failureCount < 1
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      refetchOnMount: false,
      staleTime: 60 * 1000,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const status =
        error instanceof AxiosError
          ? error.response?.status
          : (error as { status?: number } | null)?.status
      if (status === 401) {
        // Only reset if a real token existed; social-only sessions get 401s
        // from JWT-only endpoints without losing their session cookie.
        const hadToken = useAuthStore.getState().auth.accessToken
        if (hadToken) {
          useAuthStore.getState().auth.reset()
          router.navigate({ to: '/' })
        }
      }
      if (status === 500 && import.meta.env.PROD) {
        router.navigate({ to: '/500' })
      }
    },
  }),
})

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  // Cache hover-preload results long enough that follow-up navigations
  // reuse them instead of refetching when the user actually clicks.
  defaultPreloadStaleTime: 30 * 1000,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <FontProvider>
              <DirectionProvider>
                <RouterProvider router={router} />
              </DirectionProvider>
            </FontProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </StrictMode>
  )
}