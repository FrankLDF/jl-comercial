import axios from 'axios'

import { PATH_LOGIN } from '../routes/pathts'
import { showNotification } from '../utils/showNotification'

const serverCore = axios.create({
  baseURL: import.meta.env.VITE_SERVER_CORE_URL,
  withCredentials: true,
})

export const setupInterceptors = (logout: () => void) => {
  serverCore.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        logout()

        const currentPath = window.location.pathname
        if (currentPath !== PATH_LOGIN) {
          showNotification({
            title: 'INFO',
            type: 'info',
            message: 'Sesión caducada',
          })
        }
      }
      return Promise.reject(err)
    }
  )
}

export default serverCore
