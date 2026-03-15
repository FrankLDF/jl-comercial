import { Navigate, Route, Routes } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import PrivateRoutes from './PrivateRoutes'
import NotFaundPage from '../layout/NotFaundPage'
import { Login } from '../features/auth/pages/Login'
import { RegisterClient } from '../features/client/page/RegisterClient'
import ConsulClient from '../features/client/page/ConsulClient'
import ConsulProvider from '../features/provider/pages/ConsulProvider'
import RegisterProvider from '../features/provider/pages/RegisterProvider'
import ConsulRecepcion from '../features/reception/pages/ConsulRecepcion'
import RegisterRecepcion from '../features/reception/pages/RegisterRecepcion'
import ViewRecepcion from '../features/reception/pages/ViewRecepcion'
import ConsulInventario from '../features/inventario/pages/ConsulInventario'
import ConsulVenta from '../features/venta/pages/ConsulVenta'
import RegisterVenta from '../features/venta/pages/RegisterVenta'
import ViewVenta from '../features/venta/pages/ViewVenta'
import {
  PATH_CONSULT_CLIENT,
  PATH_CONSULT_INVENTARIO,
  PATH_CONSULT_PROVEEDOR,
  PATH_CONSULT_RECEPCION,
  PATH_CONSULT_VENTA,
  PATH_INICIAL,
  PATH_LOGIN,
  PATH_MAIN,
  PATH_NOT_FOUND,
  PATH_REGISTER_CLIENT,
  PATH_REGISTER_PROVEEDOR,
  PATH_REGISTER_RECEPCION,
  PATH_REGISTER_VENTA,
  PATH_VIEW_RECEPCION,
  PATH_VIEW_VENTA,
} from './pathts'

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
      <Route
        path={PATH_CONSULT_RECEPCION}
        element={
          <PrivateRoutes>
            <ConsulRecepcion />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_REGISTER_RECEPCION}
        element={
          <PrivateRoutes>
            <RegisterRecepcion />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_VIEW_RECEPCION}
        element={
          <PrivateRoutes>
            <ViewRecepcion />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_CONSULT_INVENTARIO}
        element={
          <PrivateRoutes>
            <ConsulInventario />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_CONSULT_VENTA}
        element={
          <PrivateRoutes>
            <ConsulVenta />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_REGISTER_VENTA}
        element={
          <PrivateRoutes>
            <RegisterVenta />
          </PrivateRoutes>
        }
      />
      <Route
        path={PATH_VIEW_VENTA}
        element={
          <PrivateRoutes>
            <ViewVenta />
          </PrivateRoutes>
        }
      />
      <Route path={PATH_NOT_FOUND} element={<NotFaundPage />} />
    </Routes>
  )
}

export default AppRoutes
