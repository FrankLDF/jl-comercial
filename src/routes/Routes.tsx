import { Navigate, Route, Routes } from 'react-router-dom'
import { PATH_INICIAL, PATH_LOGIN, PATH_MAIN, PATH_NOT_FOUND } from './pathts'
import PublicRoutes from './PublicRoutes'
import PrivateRoutes from './PrivateRoutes'
import NotFaundPage from '../layout/NotFaundPage'
import { Login } from '../features/auth/pages/Login'

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={PATH_LOGIN}
        element={
          <PublicRoutes>
            {/* <h1>Login</h1> */}
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
      <Route path={PATH_NOT_FOUND} element={<NotFaundPage />} />
    </Routes>
  )
}

export default AppRoutes
