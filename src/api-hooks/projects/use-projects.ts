import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createProject,
  createStep,
  deleteProject,
  deleteStep,
  getProjectsList,
  getStepDetail,
  getStepList,
  patchProject,
  patchStep,
  reorderSteps,
  updateProject,
  updateStep,
} from '@/service/projects/projects.service'
import type {
  PaginatedResponse,
  ProjectFilters,
  ProjectListItem,
  ProjectPatchRequest,
  ProjectRequest,
  ProjectStep,
  StepPatchRequest,
  StepReorderRequest,
  StepRequest,
} from '@/service/projects/projects.type'

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params?: ProjectFilters) => [...projectKeys.lists(), params] as const,
  steps: () => [...projectKeys.all, 'steps'] as const,
  stepList: (projectPk: number | string) => [...projectKeys.steps(), String(projectPk)] as const,
  step: (projectPk: number | string, id: number | string) =>
    [...projectKeys.steps(), String(projectPk), 'detail', String(id)] as const,
}

// --- Queries ---
export function useProjects(params?: ProjectFilters, options?: { enabled?: boolean }) {
  return useQuery<PaginatedResponse<ProjectListItem>, Error>({
    queryKey: projectKeys.list(params),
    queryFn: () => getProjectsList(params),
    enabled: options?.enabled ?? true,
  })
}

export function useProjectSteps(projectPk: number | string | undefined) {
  return useQuery<PaginatedResponse<ProjectStep>, Error>({
    queryKey: projectKeys.stepList(projectPk ?? ''),
    queryFn: () => getStepList(projectPk!),
    enabled: !!projectPk,
  })
}

export function useStepDetail(projectPk: number | string, id: number | string) {
  return useQuery<ProjectStep, Error>({
    queryKey: projectKeys.step(projectPk, id),
    queryFn: () => getStepDetail(projectPk, id),
    enabled: !!id && !!projectPk,
  })
}

// --- Project Mutations ---
export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation<ProjectListItem, Error, ProjectRequest>({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success('Project created')
      qc.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation<ProjectListItem, Error, { id: number | string; data: ProjectRequest }>({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => {
      toast.success('Project updated')
      qc.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export function usePatchProject() {
  const qc = useQueryClient()
  return useMutation<ProjectListItem, Error, { id: number | string; data: ProjectPatchRequest }>({
    mutationFn: ({ id, data }) => patchProject(id, data),
    onSuccess: () => {
      toast.success('Project updated')
      qc.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success('Project deleted')
      qc.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

// --- Step Mutations ---
export function useCreateProjectStep() {
  const qc = useQueryClient()
  return useMutation<ProjectStep, Error, { projectPk: number | string; data: StepRequest }>({
    mutationFn: ({ projectPk, data }) => createStep(projectPk, data),
    onSuccess: (_, vars) => {
      toast.success('Step created')
      qc.invalidateQueries({ queryKey: projectKeys.stepList(vars.projectPk) })
    },
  })
}

export function useUpdateProjectStep() {
  const qc = useQueryClient()
  return useMutation<ProjectStep, Error, { projectPk: number | string; id: number | string; data: StepRequest }>({
    mutationFn: ({ projectPk, id, data }) => updateStep(projectPk, id, data),
    onSuccess: (_, vars) => {
      toast.success('Step updated')
      qc.invalidateQueries({ queryKey: projectKeys.stepList(vars.projectPk) })
      qc.invalidateQueries({ queryKey: projectKeys.step(vars.projectPk, vars.id) })
    },
  })
}

export function usePatchProjectStep() {
  const qc = useQueryClient()
  return useMutation<ProjectStep, Error, { projectPk: number | string; id: number | string; data: StepPatchRequest }>({
    mutationFn: ({ projectPk, id, data }) => patchStep(projectPk, id, data),
    onSuccess: (_, vars) => {
      toast.success('Step updated')
      qc.invalidateQueries({ queryKey: projectKeys.stepList(vars.projectPk) })
      qc.invalidateQueries({ queryKey: projectKeys.step(vars.projectPk, vars.id) })
    },
  })
}

export function useDeleteProjectStep() {
  const qc = useQueryClient()
  return useMutation<void, Error, { projectPk: number | string; id: number | string }>({
    mutationFn: ({ projectPk, id }) => deleteStep(projectPk, id),
    onSuccess: (_, vars) => {
      toast.success('Step deleted')
      qc.invalidateQueries({ queryKey: projectKeys.stepList(vars.projectPk) })
    },
  })
}

export function useReorderProjectSteps(projectPk: number | string) {
  const qc = useQueryClient()
  return useMutation<ProjectStep[], Error, StepReorderRequest>({
    mutationFn: (data) => reorderSteps(data),
    onSuccess: () => {
      toast.success('Order updated')
      qc.invalidateQueries({ queryKey: projectKeys.stepList(projectPk) })
    },
  })
}
