import { useShallow } from 'zustand/react/shallow'
import { useAdminStore } from './admin-store'
import { useAuthStore } from './auth-store'
import { useProfileStore } from './profile-store'
import { useUserStore } from './user-store'

// ── Admin store ───────────────────────────────────────────────
export const useCourses = () => useAdminStore((s) => s.courses)
export const useProjects = () => useAdminStore((s) => s.projects)
export const useSources = () => useAdminStore((s) => s.sources)
export const useTotalStudents = () => useAdminStore((s) => s.totalStudents)
export const useTotalRevenue = () => useAdminStore((s) => s.totalRevenue)

export const useAdminStats = () =>
  useAdminStore(
    useShallow((s) => ({
      totalStudents: s.totalStudents,
      totalRevenue: s.totalRevenue,
    }))
  )

export const useCourseActions = () =>
  useAdminStore(
    useShallow((s) => ({
      addCourse: s.addCourse,
      updateCourse: s.updateCourse,
      deleteCourse: s.deleteCourse,
      addModule: s.addModule,
      updateModule: s.updateModule,
      deleteModule: s.deleteModule,
      addLesson: s.addLesson,
      updateLesson: s.updateLesson,
      deleteLesson: s.deleteLesson,
    }))
  )

export const useProjectActions = () =>
  useAdminStore(
    useShallow((s) => ({
      addProject: s.addProject,
      updateProject: s.updateProject,
      deleteProject: s.deleteProject,
    }))
  )

export const useSourceActions = () =>
  useAdminStore(
    useShallow((s) => ({
      addSource: s.addSource,
      updateSource: s.updateSource,
      deleteSource: s.deleteSource,
    }))
  )

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
      markLessonWatched: s.markLessonWatched,
      isEnrolled: s.isEnrolled,
      getWatchedLessons: s.getWatchedLessons,
    }))
  )
