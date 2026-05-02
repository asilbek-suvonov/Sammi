import { useMutation } from '@tanstack/react-query'
import { login, type LoginRequest, type LoginResponse } from '@/service/auth'

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
