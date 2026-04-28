import type { Course } from '@/data/mock-data'

const parseDurationToSeconds = (duration: string): number => {
  const parts = duration.split(':').map((p) => parseInt(p, 10) || 0)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

export interface CourseStats {
  moduleCount: number
  lessonCount: number
  totalSeconds: number
  totalHours: number
  hoursLabel: string
}

export function getCourseStats(course: Course): CourseStats {
  const moduleCount = course.modules.length
  const lessons = course.modules.flatMap((m) => m.lessons)
  const totalSeconds = lessons.reduce(
    (acc, l) => acc + parseDurationToSeconds(l.duration),
    0
  )
  const totalHours = totalSeconds / 3600
  const hoursLabel =
    totalHours >= 1 ? `${Math.round(totalHours)}h` : `${Math.round(totalSeconds / 60)}m`

  return {
    moduleCount,
    lessonCount: lessons.length,
    totalSeconds,
    totalHours,
    hoursLabel,
  }
}
