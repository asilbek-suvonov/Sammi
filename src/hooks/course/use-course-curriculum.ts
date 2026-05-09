import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { moduleKeys, useModules } from '@/api-hooks/module/use-modules'
import { getModuleDetail } from '@/service/module/module.service'
import type { Lesson } from '@/service/lessons/lessons.types'

export interface CurriculumModule {
  id: number
  title: string
  order: number
  lessons: Lesson[]
}

export function useCourseCurriculum(courseId: string, enabled = false) {
  const { data: allModules, isLoading: modulesLoading } = useModules()

  const courseModules = useMemo(
    () => (allModules ?? []).filter((m) => m.course === Number(courseId)),
    [allModules, courseId],
  )

  const detailQueries = useQueries({
    queries: courseModules.map((mod) => ({
      queryKey: moduleKeys.detail(mod.id),
      queryFn: () => getModuleDetail(mod.id),
      enabled: enabled && !modulesLoading,
      staleTime: 5 * 60 * 1000,
    })),
  })

  const modules: CurriculumModule[] = courseModules.map((mod, i) => ({
    id: mod.id,
    title: mod.title,
    order: mod.order,
    lessons: detailQueries[i]?.data?.lessons ?? [],
  }))

  const flatLessons: Lesson[] = modules.flatMap((m) => m.lessons)

  const isLoading =
    modulesLoading || (enabled && detailQueries.some((q) => q.isLoading))

  return { modules, flatLessons, isLoading }
}
