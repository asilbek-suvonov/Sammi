import { useEffect, useMemo, useState } from 'react'
import { useCreateEnrollment } from '@/api-hooks/enrollment/use-enrollment'
import {
  useCreateLessonProgress,
  useLessonProgressList,
  usePatchLessonProgress,
} from '@/api-hooks/lesson-progress/use-progress'
import type { Lesson } from '@/service/lessons/lessons.types'
import { useAccessToken } from '@/stores/selectors'

interface Options {
  courseId: string
  flatLessons: Lesson[]
}

export function useLessonTracking({ courseId, flatLessons }: Options) {
  const token = useAccessToken()
  const isLoggedIn = !!token

  // ── Enrollment ────────────────────────────────────────────────────────────
  const { mutate: enrollFn } = useCreateEnrollment()
  const courseIdNum = Number(courseId)

  useEffect(() => {
    if (!isLoggedIn || courseIdNum === 0) return
    enrollFn({ course: courseIdNum })
  }, [isLoggedIn, courseIdNum, enrollFn])

  // ── Progress list ─────────────────────────────────────────────────────────
  const { data: progressData } = useLessonProgressList(undefined, {
    enabled: isLoggedIn,
  })

  // lessonId → { progressId, is_completed }
  const progressMap = useMemo(() => {
    const map = new Map<number, { progressId: number; isCompleted: boolean }>()
    for (const p of progressData?.results ?? []) {
      const lessonId = typeof p.lesson === 'number' ? p.lesson : p.lesson.id
      map.set(lessonId, { progressId: p.id, isCompleted: p.is_completed })
    }
    return map
  }, [progressData])

  // Lesson IDs of this course that are completed (API + optimistic local)
  const [localCompleted, setLocalCompleted] = useState<Set<number>>(new Set())

  const apiCompleted = useMemo(() => {
    const courseLessonIds = new Set(flatLessons.map((l) => l.id))
    return new Set(
      [...progressMap.entries()]
        .filter(([lessonId, { isCompleted }]) => isCompleted && courseLessonIds.has(lessonId))
        .map(([lessonId]) => lessonId),
    )
  }, [progressMap, flatLessons])

  const completedIds = useMemo(
    () => new Set([...apiCompleted, ...localCompleted]),
    [apiCompleted, localCompleted],
  )

  // ── Mark done ─────────────────────────────────────────────────────────────
  const { mutate: createProgress } = useCreateLessonProgress()
  const { mutate: patchProgress } = usePatchLessonProgress()

  const markDone = (lessonId: number) => {
    // Optimistic update immediately
    setLocalCompleted((prev) => new Set([...prev, lessonId]))

    if (!isLoggedIn) return

    const existing = progressMap.get(lessonId)
    if (existing) {
      // Record exists → PATCH to update (avoids 400 "already exists")
      patchProgress({ id: existing.progressId, data: { is_completed: true } })
    } else {
      // No record → POST to create
      createProgress({ lesson: lessonId, is_completed: true })
    }
  }

  return { completedIds, markDone }
}
