import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from './auth-store'
import { useProfileStore } from './profile-store'
import { useUserStore } from './user-store'

// ── Auth store ────────────────────────────────────────────────
export const useAuthUser = () => useAuthStore((s) => s.auth.user)
export const useAuthRole = () =>
  useAuthStore((s) => s.auth.user?.role ?? 'user')
export const useAccessToken = () => useAuthStore((s) => s.auth.accessToken)

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

// ── User store ────────────────────────────────────────────────
export const useEnrolledCourses = () => useUserStore((s) => s.enrolledCourses)
export const useUserActions = () =>
  useUserStore(
    useShallow((s) => ({
      enrollCourse: s.enrollCourse,
      isEnrolled: s.isEnrolled,
    }))
  )
