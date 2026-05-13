import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from './auth-store'
import { useProfileStore } from './profile-store'

// ── Auth store ────────────────────────────────────────────────
export const useAuthUser = () => useAuthStore((s) => s.auth.user)
export const useAuthRole = () =>
  useAuthStore((s) => s.auth.user?.role ?? 'user')
export const useAccessToken = () => useAuthStore((s) => s.auth.accessToken)

// True when a user is signed in via ANY flow: JWT (admin/OTP) OR
// social session (Google/GitHub return user only — no token).
// Always use this for "is signed in" UI gates, not raw accessToken.
export const useIsAuthed = () =>
  useAuthStore((s) => !!(s.auth.accessToken || s.auth.user))

export const useAuthActions = () =>
  useAuthStore(
    useShallow((s) => ({
      setUser: s.auth.setUser,
      setAccessToken: s.auth.setAccessToken,
      resetAccessToken: s.auth.resetAccessToken,
      reset: s.auth.reset,
    }))
  )

// ── Profile store ─────────────────────────────────────────────
export const useProfile = () => useProfileStore((s) => s.profile)
export const useSetProfile = () => useProfileStore((s) => s.setProfile)
export const useResetProfile = () => useProfileStore((s) => s.resetProfile)
