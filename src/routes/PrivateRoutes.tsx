import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { PATH_LOGIN } from './pathts'
import { getSessionInfo } from '../utils/getSessionInfo'
import { AppShell } from '../layout/AppShell'

interface PrivateRoutesProps {
  children: ReactNode
}

function PrivateRoutes({ children }: PrivateRoutesProps) {
  const isLogged = getSessionInfo()

  return !isLogged ? (
    <Navigate to={PATH_LOGIN} replace />
  ) : (
    <AppShell
      headerContent={<div>Mi Header</div>}
      navContent={<div>Menú o navegación</div>}
    >
      {children}
    </AppShell>
  )
}

export default PrivateRoutes
