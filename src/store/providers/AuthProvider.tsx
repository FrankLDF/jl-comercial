import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type User } from '../context/AuthContex'
import type { AuthCredentials } from '../../features/auth/models/authCredencials'
import AuthService from '../../features/auth/services/auth'
import { setupInterceptors } from '../../interceptors/axiosInstance'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = async () => {
    await AuthService.logout()
    setUser(null)
    localStorage.removeItem('sessionUser')
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('sessionUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
    setupInterceptors(logout)
  }, [])

  const login = async (credentials: AuthCredentials) => {
    const data = await AuthService.login(credentials)
    if (data) {
      setUser(data.user)
      localStorage.setItem('sessionUser', JSON.stringify(data.user))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
