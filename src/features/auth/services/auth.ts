import serverCore from '../../../interceptors/axiosInstance'
import type { AuthCredentials } from '../models/authCredencials'

class AuthService {
  async login(credentials: AuthCredentials) {
    const res = await serverCore.post(`/user/login`, credentials)
    return res.data
  }

  async logout() {
    const res = await serverCore.post(`/user/logout`)
    return res.data
  }
}

export default new AuthService()
