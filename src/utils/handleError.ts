import type { AxiosError } from 'axios'
import { showNotification } from './showNotification'

type ErrorResponse = {
  message: string
}
export const showHandleError = (err: AxiosError<ErrorResponse>) => {
  showNotification({
    type: 'error',
    message: `${err?.message}`,
  })
}
