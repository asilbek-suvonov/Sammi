import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EnrolledCourse {
  courseId: string
  enrolledAt: number
  watchedLessons: string[]
}

interface UserState {
  enrolledCourses: EnrolledCourse[]
  enrollCourse: (courseId: string) => void
  markLessonWatched: (courseId: string, lessonId: string) => void
  isEnrolled: (courseId: string) => boolean
  getWatchedLessons: (courseId: string) => string[]
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
              { courseId, enrolledAt: Date.now(), watchedLessons: [] },
            ],
          }
        }),
      markLessonWatched: (courseId, lessonId) =>
        set((state) => ({
          enrolledCourses: state.enrolledCourses.map((c) =>
            c.courseId === courseId && !c.watchedLessons.includes(lessonId)
              ? { ...c, watchedLessons: [...c.watchedLessons, lessonId] }
              : c
          ),
        })),
      isEnrolled: (courseId) =>
        get().enrolledCourses.some((c) => c.courseId === courseId),
      getWatchedLessons: (courseId) =>
        get().enrolledCourses.find((c) => c.courseId === courseId)?.watchedLessons ?? [],
    }),
    { name: 'sammi_user_data' }
  )
)
