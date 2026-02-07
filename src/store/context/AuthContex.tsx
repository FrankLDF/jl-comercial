import { createContext } from 'react'
import type { AuthCredentials } from '../../features/auth/models/authCredencials'

export type User = {
  id: number
  id_personal: number
  nombre_usuario: string
  estado: string
  fecha_insercion: string
  usuario_insercion: string
  fecha_actualizacion: string | null
  usuario_actualizacion: string | null
  token?: string
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (credentials: AuthCredentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
