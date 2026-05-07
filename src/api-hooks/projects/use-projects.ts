import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createProject,
  createStep,
  deleteProject,
  getProjectDetail,
  getProjectsList,
  getStepDetail,
  patchProject,
  updateProject,
} from '@/service/projects/projects.service'
import type {
  PaginatedResponse,
  ProjectDetail,
  ProjectFilters,
  ProjectListItem,
  ProjectPatchRequest,
  ProjectRequest,
  ProjectStep,
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
