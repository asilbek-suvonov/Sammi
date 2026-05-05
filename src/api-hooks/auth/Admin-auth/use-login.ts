import { login } from '@/service/auth/admin-auth/login.service'
import type { LoginRequest, LoginResponse } from '@/service/auth/admin-auth/login.type'
import { useMutation } from '@tanstack/react-query'

export const useAuthLogin = (options?: {
  onSuccess?: (data: LoginResponse) => void
  onError?: (error: Error) => void
}) => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
