import { useEffect, useMemo, useState } from 'react'
import {
  useLessonProgressList,
  usePatchLessonProgress,
  useUpsertLessonProgressCompleted,
} from '@/api-hooks/lesson-progress/use-progress'
import type { Lesson } from '@/service/lessons/lessons.types'
import { useIsAuthed } from '@/stores/selectors'

interface Options {
  flatLessons: Lesson[]
  courseId?: number | string
}

export function useLessonTracking({ flatLessons, courseId }: Options) {
  // Fire the request for any authenticated user (JWT or cookie session) so
  // Google OAuth users get their progress persisted on the backend too.
  // 401s for unsupported auth combos are handled silently by the interceptor.
  const isAuthed = useIsAuthed()

  const { data: progressData } = useLessonProgressList(undefined, {
    enabled: isAuthed,
  })

  const progressMap = useMemo(() => {
    const map = new Map<number, { progressId: number; isCompleted: boolean }>()
    for (const p of progressData?.results ?? []) {
      const lessonId = typeof p.lesson === 'number' ? p.lesson : p.lesson.id
      map.set(lessonId, { progressId: p.id, isCompleted: p.is_completed })
    }
    return map
  }, [progressData])

  const [localCompleted, setLocalCompleted] = useState<Set<number>>(() => {
    const key =
      courseId === undefined || courseId === null || courseId === '' || courseId === '0'
        ? null
        : `sammi_course_preview_completed:${String(courseId)}`

    if (!key) return new Set()

    try {
      const raw = localStorage.getItem(key)
      if (!raw) return new Set()
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) return new Set()
      const ids = parsed
        .filter((x) => Number.isFinite(Number(x)))
        .map((x) => Number(x))
      return new Set(ids)
    } catch {
      return new Set()
    }
  })
  const courseKey = useMemo(() => {
    if (courseId === undefined || courseId === null || courseId === '' || courseId === '0') return null
    return `sammi_course_preview_completed:${String(courseId)}`
  }, [courseId])

  // Persist locally as a fallback for unauthenticated flows (and as a UX cache for authed).
  useEffect(() => {
    if (!courseKey) return
    try {
      localStorage.setItem(courseKey, JSON.stringify([...localCompleted]))
    } catch {
      /* ignore */
    }
  }, [courseKey, localCompleted])

  const apiCompleted = useMemo(() => {
    const courseLessonIds = new Set(flatLessons.map((l) => l.id))
    return new Set(
      [...progressMap.entries()]
        .filter(
          ([lessonId, { isCompleted }]) =>
            isCompleted && courseLessonIds.has(lessonId)
        )
        .map(([lessonId]) => lessonId)
    )
  }, [progressMap, flatLessons])

  const completedIds = useMemo(
    () => new Set([...apiCompleted, ...localCompleted]),
    [apiCompleted, localCompleted]
  )

  const { mutate: patchProgress } = usePatchLessonProgress()
  const { mutate: upsertCompleted } = useUpsertLessonProgressCompleted()

  const markDone = (lessonId: number) => {
    setLocalCompleted((prev) => new Set([...prev, lessonId]))

    if (!isAuthed) return

    const existing = progressMap.get(lessonId)
    if (existing) {
      patchProgress({ id: existing.progressId, data: { is_completed: true } })
    } else {
      upsertCompleted(lessonId)
    }
  }

  return { completedIds, markDone }
}
