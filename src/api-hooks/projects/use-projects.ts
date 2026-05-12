import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createProject,
  createStep,
  deleteProject,
  deleteStep,
  getProjectDetail,
  getProjectsList,
  getStepDetail,
  patchProject,
  patchStep,
  reorderSteps,
  updateProject,
  updateStep,
} from '@/service/projects/projects.service'
import type {
  PaginatedResponse,
  ProjectDetail,
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
  list: (params?: ProjectFilters) => [...projectKeys.all, 'list', params] as const,
  detail: (id: number | string) => [...projectKeys.all, 'detail', String(id)] as const,
  steps: () => ['project-steps'] as const,
  step: (id: number | string) => [...projectKeys.steps(), String(id)] as const,
}

export function useProjects(params?: ProjectFilters) {
  return useQuery<PaginatedResponse<ProjectListItem>, Error>({
    queryKey: projectKeys.list(params),
    queryFn: () => getProjectsList(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProject(id: number | string | undefined, enabled = true) {
  return useQuery<ProjectDetail, Error>({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: () => getProjectDetail(id as number | string),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation<ProjectDetail, Error, ProjectRequest>({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success('Project created successfully')
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create project')
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation<
    ProjectDetail,
    Error,
    { id: number | string; data: ProjectRequest }
  >({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (_, vars) => {
      toast.success('Project updated successfully')
      qc.invalidateQueries({ queryKey: projectKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update project')
    },
  })
}

export function usePatchProject() {
  const qc = useQueryClient()
  return useMutation<
    ProjectDetail,
    Error,
    { id: number | string; data: ProjectPatchRequest }
  >({
    mutationFn: ({ id, data }) => patchProject(id, data),
    onSuccess: (_, vars) => {
      toast.success('Project updated successfully')
      qc.invalidateQueries({ queryKey: projectKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update project')
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success('Project deleted successfully')
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete project')
    },
  })
}

export function useProjectStep(id: number | string | undefined, enabled = true) {
  return useQuery<ProjectStep, Error>({
    queryKey: projectKeys.step(id ?? ''),
    queryFn: () => getStepDetail(id as number | string),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProjectStep() {
  const qc = useQueryClient()
  return useMutation<ProjectStep, Error, StepRequest>({
    mutationFn: createStep,
    onSuccess: () => {
      toast.success('Step created successfully')
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.steps() })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create step')
    },
  })
}

export function useUpdateProjectStep() {
  const qc = useQueryClient()
  return useMutation<
    ProjectStep,
    Error,
    { id: number | string; data: StepRequest }
  >({
    mutationFn: ({ id, data }) => updateStep(id, data),
    onSuccess: (_, vars) => {
      toast.success('Step updated successfully')
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.step(vars.id) })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update step')
    },
  })
}

export function usePatchProjectStep() {
  const qc = useQueryClient()
  return useMutation<
    ProjectStep,
    Error,
    { id: number | string; data: StepPatchRequest }
  >({
    mutationFn: ({ id, data }) => patchStep(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.step(vars.id) })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update step')
    },
  })
}

export function useDeleteProjectStep() {
  const qc = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationFn: deleteStep,
    onSuccess: () => {
      toast.success('Step deleted')
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete step')
    },
  })
}

export function useReorderProjectSteps() {
  const qc = useQueryClient()
  return useMutation<ProjectStep[], Error, StepReorderRequest>({
    mutationFn: reorderSteps,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reorder steps')
    },
  })
}
