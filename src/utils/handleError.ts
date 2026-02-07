import type { AxiosError } from 'axios'
import { showNotification } from './showNotification'

type ErrorResponse = {
  message: string
  errors?: any
}

export const showHandleError = (err: AxiosError<ErrorResponse>) => {
  // No mostrar notificación para errores 401 (son manejados por el interceptor)
  if (err?.response?.status === 401) {
    return
  }

  const errorMessage =
    err?.response?.data?.message ||
    err?.message ||
    'Ha ocurrido un error inesperado'

  showNotification({
    type: 'error',
    message: errorMessage,
  })
}
