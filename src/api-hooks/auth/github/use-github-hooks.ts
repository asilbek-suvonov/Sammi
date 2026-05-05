import { useMutation } from '@tanstack/react-query'
import { githubAuth } from '@/service/auth/github/github.service'
import type { AuthRequest, AuthResponse } from '@/service/auth/github/github.type'

export const useGithubAuth = (options?: {
  onSuccess?: (data: AuthResponse) => void
  onError?: (error: Error) => void
}) => {
  return useMutation<AuthResponse, Error, AuthRequest>({
    mutationFn: githubAuth,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
