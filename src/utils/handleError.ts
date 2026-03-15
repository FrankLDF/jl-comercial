import { showNotification } from './showNotification'

export const showHandleError = (err: any) => {
  // No mostrar notificación para errores 401 (son manejados por el interceptor)
  if (err?.response?.status === 401) {
    return
  }

  // Si fue rechazado por el interceptor con res.data directamente: err.message
  // Si es un error de Axios tradicional: err.response.data.message
  console.log('err', err)
  const errorMessage =
    err?.response?.data?.message ||
    err?.message ||
    (typeof err === 'string' ? err : 'Ha ocurrido un error inesperado')

  showNotification({
    type: 'error',
    message: errorMessage,
  })
}
