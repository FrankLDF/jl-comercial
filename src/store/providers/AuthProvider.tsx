import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type User } from '../context/AuthContex'
import type { AuthCredentials } from '../../features/auth/models/authCredencials'
import AuthService from '../../features/auth/services/auth'
import { setupInterceptors } from '../../interceptors/axiosInstance'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const clearSession = () => {
    setUser(null)
    localStorage.removeItem('sessionUser')
  }

  const logout = async () => {
    try {
      if (user) {
        await AuthService.logout()
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      clearSession()
    }
  }

  const loadUserFromStorage = async () => {
    const storedUser = localStorage.getItem('sessionUser')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        const userData = await AuthService.getMe()
        console.log({ 2: userData })
        const userWithToken = { ...userData, token: parsedUser.token }
        setUser(userWithToken)
        localStorage.setItem('sessionUser', JSON.stringify(userWithToken))
      } catch (error) {
        console.error('Error parsing sessionUser:', error)
        clearSession()
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUserFromStorage()
    setupInterceptors(logout)
  }, [])

  const login = async (credentials: AuthCredentials) => {
    const userData = await AuthService.login(credentials)
    if (userData) {
      setUser(userData?.data)
      localStorage.setItem('sessionUser', JSON.stringify(userData?.data))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
