import serverCore from '../../../interceptors/axiosInstance'
import type { AuthCredentials } from '../models/authCredencials'

class AuthService {
  async login(credentials: AuthCredentials) {
    const res = await serverCore.post(`/login`, credentials)
    if (res.data) {
      localStorage.setItem('sessionUser', JSON.stringify(res?.data?.data?.user))
    }
    return res.data
  }

  async logout() {
    const res = await serverCore.post(`/logout`)
    if (res.data) {
      localStorage.removeItem('sessionUser')
    }
    return res.data
  }

  async checkAuth() {
    const res = await serverCore.get(`/user`)
    return res.data
  }
}

export default new AuthService()
