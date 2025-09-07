import { createContext } from 'react'
import type { AuthCredentials } from '../../features/auth/models/authCredencials'

export type User = {
  ID: number
  ID_PERSONAL: number
  NOMBRE_USUARIO: string
  ESTADO: string
  FECHA_INSERCION: string
  USUARIO_INSERCION: string
  FECHA_ACTUALIZACION: string | null
  USUARIO_ACTUALIZACION: string | null
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (credentials: AuthCredentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
