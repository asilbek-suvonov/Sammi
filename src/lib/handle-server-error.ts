import { AxiosError } from 'axios'
import { toast } from 'sonner'
import type { ApiError } from '@/api'

export function handleServerError(error: unknown) {
  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'Content not found.'
  }

  if (error instanceof AxiosError) {
    const data = error.response?.data as Record<string, unknown>
    const nonFieldErrors = data?.non_field_errors as unknown[]
    if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
      errMsg = String(nonFieldErrors[0])
    } else {
      const title = typeof data?.title === 'string' ? data.title : undefined
      const message = typeof data?.message === 'string' ? data.message : undefined
      const detail = typeof data?.detail === 'string' ? data.detail : undefined
      errMsg = title || message || detail || error.message || 'Something went wrong!'
    }
  } else if (error && typeof error === 'object' && !Array.isArray(error)) {
    // ApiError from interceptor (plain object with message/status/data)
    const apiErr = error as Partial<ApiError>
    if (apiErr.data && typeof apiErr.data === 'object') {
      const data = apiErr.data as Record<string, unknown>
      if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        errMsg = String(data.non_field_errors[0])
      } else if (typeof data.message === 'string') {
        errMsg = data.message
      } else if (typeof data.detail === 'string') {
        errMsg = data.detail
      } else if (typeof apiErr.message === 'string') {
        errMsg = apiErr.message
      }
    } else if (typeof apiErr.message === 'string') {
      errMsg = apiErr.message
    }
  } else if (error instanceof Error) {
    errMsg = error.message
  }

  toast.error(errMsg)
}
