import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Course, type Project, COURSES, PROJECTS } from '@/data/mock-data'

interface AdminState {
  courses: Course[]
  projects: Project[]
  totalStudents: number
  totalRevenue: number
  addCourse: (course: Course) => void
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourse: (id: string) => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      courses: COURSES,
      projects: PROJECTS,
      totalStudents: COURSES.reduce((acc, c) => acc + c.students, 0),
      totalRevenue: 142800,
      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (id, updates) =>
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCourse: (id) =>
        set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),
    }),
    { name: 'sammi_admin_data' }
  )
)
