import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EnrolledCourse {
  courseId: string
  enrolledAt: number
}

interface UserState {
  enrolledCourses: EnrolledCourse[]
  enrollCourse: (courseId: string) => void
  isEnrolled: (courseId: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      enrolledCourses: [],
      enrollCourse: (courseId) =>
        set((state) => {
          if (state.enrolledCourses.some((c) => c.courseId === courseId)) return state
          return {
            enrolledCourses: [
              ...state.enrolledCourses,
              { courseId, enrolledAt: Date.now() },
            ],
          }
        }),
      isEnrolled: (courseId) =>
        get().enrolledCourses.some((c) => c.courseId === courseId),
    }),
    { name: 'sammi_user_data', version: 2 }
  )
)
