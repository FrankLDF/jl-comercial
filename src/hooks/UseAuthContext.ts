import { useContext } from 'react'
import { AuthContext } from '../store/context/AuthContex'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
