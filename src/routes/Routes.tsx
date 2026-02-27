import { Navigate, Route, Routes } from 'react-router-dom'
import {
  PATH_CONSULT_CLIENT,
  PATH_CONSULT_PROVEEDOR,
  PATH_INICIAL,
  PATH_LOGIN,
  PATH_MAIN,
  PATH_NOT_FOUND,
  PATH_REGISTER_CLIENT,
  PATH_REGISTER_PROVEEDOR,
} from './pathts'
import PublicRoutes from './PublicRoutes'
import PrivateRoutes from './PrivateRoutes'
import NotFaundPage from '../layout/NotFaundPage'
import { Login } from '../features/auth/pages/Login'
import { RegisterClient } from '../features/client/page/RegisterClient'
import ConsulClient from '../features/client/page/ConsulClient'
import ConsulProvider from '../features/provider/pages/ConsulProvider'
import RegisterProvider from '../features/provider/pages/RegisterProvider'

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={PATH_LOGIN}
        element={
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        }
      />
      <Route
        path={PATH_INICIAL}
        element={<Navigate to={PATH_LOGIN} replace />}
      />
      <Route
        path={PATH_MAIN}
        element={<PrivateRoutes>Holaa desde aqui</PrivateRoutes>}
      />
      <Route
        path={PATH_REGISTER_CLIENT}
        element={
          <PrivateRoutes>
            <RegisterClient />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_CONSULT_CLIENT}
        element={
          <PrivateRoutes>
            <ConsulClient />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_CONSULT_PROVEEDOR}
        element={
          <PrivateRoutes>
            <ConsulProvider />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_REGISTER_PROVEEDOR}
        element={
          <PrivateRoutes>
            <RegisterProvider />
          </PrivateRoutes>
        }
      />
      <Route path={PATH_NOT_FOUND} element={<NotFaundPage />} />
    </Routes>
  )
}

export default AppRoutes
