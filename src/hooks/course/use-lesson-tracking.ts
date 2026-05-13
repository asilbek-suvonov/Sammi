import { useMemo, useState } from 'react'
import {
  useCreateLessonProgress,
  useLessonProgressList,
  usePatchLessonProgress,
} from '@/api-hooks/lesson-progress/use-progress'
import type { Lesson } from '@/service/lessons/lessons.types'
import { useIsAuthed } from '@/stores/selectors'

interface Options {
  flatLessons: Lesson[]
}

export function useLessonTracking({ flatLessons }: Options) {
  const isLoggedIn = useIsAuthed()

  const { data: progressData } = useLessonProgressList(undefined, {
    enabled: isLoggedIn,
  })

  const progressMap = useMemo(() => {
    const map = new Map<number, { progressId: number; isCompleted: boolean }>()
    for (const p of progressData?.results ?? []) {
      const lessonId = typeof p.lesson === 'number' ? p.lesson : p.lesson.id
      map.set(lessonId, { progressId: p.id, isCompleted: p.is_completed })
    }
    return map
  }, [progressData])

  const [localCompleted, setLocalCompleted] = useState<Set<number>>(new Set())

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

  const { mutate: createProgress } = useCreateLessonProgress()
  const { mutate: patchProgress } = usePatchLessonProgress()

  const markDone = (lessonId: number) => {
    setLocalCompleted((prev) => new Set([...prev, lessonId]))

    // Both JWT (admin/OTP) and social (Google/GitHub session cookie) flows
    // can persist progress — `withCredentials: true` sends cookies on every
    // request, so session-authed users hit the same endpoint successfully.
    if (!isLoggedIn) return

    const existing = progressMap.get(lessonId)
    if (existing) {
      patchProgress({ id: existing.progressId, data: { is_completed: true } })
    } else {
      createProgress({ lesson: lessonId, is_completed: true })
    }
  }

  return { completedIds, markDone }
}
