import axios from 'axios'
import { PATH_LOGIN } from '../routes/pathts'
import { showNotification } from '../utils/showNotification'

const serverCore = axios.create({
  baseURL: import.meta.env.VITE_SERVER_CORE_URL,
  withCredentials: true,
})

serverCore.interceptors.request.use((config) => {
  const sessionUser = localStorage.getItem('sessionUser')
  if (sessionUser) {
    try {
      const user = JSON.parse(sessionUser)
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    } catch (error) {
      console.error('Error parsing sessionUser for token:', error)
    }
  }
  return config
})

let isHandling401 = false

export const setupInterceptors = (logout: () => void) => {
  serverCore.interceptors.response.use(
    (res) => {
      // Si el backend devuelve success: false incluso con status 200/201, lo tratamos como error
      if (res.data && res.data.success === false) {
        return Promise.reject(res.data)
      }
      return res
    },
    async (err) => {
      const currentPath = window.location.pathname
      const isLoginPage = currentPath === PATH_LOGIN

      const requestUrl = err.config?.url || ''
      const isSessionValidation = requestUrl.includes('/user/me')

      if (
        err.response?.status === 401 &&
        !isHandling401 &&
        !isLoginPage &&
        !isSessionValidation
      ) {
        const hasSession = localStorage.getItem('sessionUser')

        if (hasSession) {
          isHandling401 = true
          try {
            await logout()
          } catch (logoutError) {
            console.error('Error al hacer logout:', logoutError)
          } finally {
            showNotification({
              title: 'INFO',
              type: 'info',
              message: 'Sesión caducada',
            })

            // Reset del flag después de un pequeño delay
            setTimeout(() => {
              isHandling401 = false
            }, 1000)
          }
        }
      } else if (err.response?.status === 401 && isLoginPage) {
        showNotification({
          type: 'error',
          message: err?.response?.data?.message,
        })
        return Promise.reject(err)
      }
    },
  )
}

export default serverCore
