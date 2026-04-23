import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Course, type Project, COURSES, PROJECTS, SOURCES, type Source } from '@/data/mock-data'

export interface AdminSource extends Source {
  id: string
  forks?: number
  language?: string
  updated?: string
  tags?: string[]
}

interface AdminState {
  courses: Course[]
  projects: Project[]
  sources: AdminSource[]
  totalStudents: number
  totalRevenue: number
  addCourse: (course: Course) => void
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourse: (id: string) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  addSource: (source: AdminSource) => void
  deleteSource: (id: string) => void
}

const defaultSources: AdminSource[] = SOURCES.map((s, i) => ({
  ...s,
  id: String(i + 1),
  forks: [48, 92, 33][i] ?? 0,
  language: 'TypeScript',
  updated: ['2 days ago', '1 day ago', '5 days ago'][i] ?? '',
  tags: [['React', 'Tailwind'], ['TanStack', 'Zustand'], ['Radix UI', 'shadcn']][i] ?? [],
}))

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      courses: COURSES,
      projects: PROJECTS,
      sources: defaultSources,
      totalStudents: COURSES.reduce((acc, c) => acc + c.students, 0),
      totalRevenue: 142800,
      addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (id, updates) =>
        set((state) => ({ courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
      deleteCourse: (id) => set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) =>
        set((state) => ({ projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deleteProject: (id) => set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
      addSource: (source) => set((state) => ({ sources: [...state.sources, source] })),
      deleteSource: (id) => set((state) => ({ sources: state.sources.filter((s) => s.id !== id) })),
    }),
    { name: 'sammi_admin_data' }
  )
)
