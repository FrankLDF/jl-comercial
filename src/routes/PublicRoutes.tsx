import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { PATH_MAIN } from './pathts'
import { useAuth } from '../hooks/UseAuthContext'

interface PublicRouterProps {
  children: ReactNode
}

function PublicRoutes({ children }: PublicRouterProps) {
  const { user } = useAuth()
  return user ? <Navigate to={PATH_MAIN} /> : children
}

export default PublicRoutes
