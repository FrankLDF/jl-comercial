import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { PATH_LOGIN } from './pathts'
import { AppShell } from '../layout/AppShell'
import Header from '../components/header/Header'
import { Navbar } from '../components/navbar/Navbar'
import { useAuth } from '../hooks/UseAuthContext'
import { Spin } from 'antd'

interface PrivateRoutesProps {
  children: ReactNode
}

function PrivateRoutes({ children }: PrivateRoutesProps) {
  const { user, loading } = useAuth()

  // Mostrar loader mientras se valida la sesión
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to={PATH_LOGIN} replace />
  }

  // Si hay usuario, mostrar el contenido protegido
  return (
    <AppShell headerContent={<Header />} navContent={<Navbar />}>
      {children}
    </AppShell>
  )
}

export default PrivateRoutes
