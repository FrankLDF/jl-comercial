import {
  Avatar,
  Grid,
  Row,
  Col,
  Dropdown,
  type MenuProps,
  Typography,
  Tooltip,
} from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { CustomButton } from '../Button/CustomButton'
import { CustomConfirm } from '../pop-confirm/CustomConfirm'
import { useCustomMutation } from '../../hooks/UseCustomMutation'
import { useAuth } from '../../hooks/UseAuthContext'
import { showNotification } from '../../utils/showNotification'

const { Text } = Typography

function Header() {
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const { user, logout } = useAuth()
  const firstLetter = user?.nombre_usuario?.slice(0, 2)?.toUpperCase() || 'U'
  const { mutate: logoutnUser, isPending } = useCustomMutation({
    execute: logout,
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: 'Sesión cerrada correctamente',
      })
    },
    onError: (err) => {
      console.error('Error al cerrar sesión:', err)
      // Aunque falle el logout en el backend, limpiar la sesión local
      showNotification({
        type: 'warning',
        message: 'Sesión cerrada localmente',
      })
    },
  })

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'name',
      label: <Text strong>{user?.nombre_usuario || 'Usuario'}</Text>,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span onClick={() => logoutnUser()}>Cerrar sesión</span>,
    },
  ]

  return (
    <Row justify="space-between" align="middle" style={{ height: '100%' }}>
      <Col>
        <img
          src="/logo.png"
          alt="logo empresa"
          style={{
            height: '40px',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </Col>

      <Col>
        {isMobile ? (
          <Dropdown
            menu={{ items: dropdownItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />}>
              {firstLetter}
            </Avatar>
          </Dropdown>
        ) : (
          <Row align="middle" gutter={8}>
            <Col>
              <Avatar>{firstLetter}</Avatar>
            </Col>
            <Col>
              <Text style={{ color: 'white' }} strong>
                {user?.nombre_usuario || 'Usuario'}
              </Text>
            </Col>
            <Col>
              <Tooltip title="Cerrar sesión">
                <CustomConfirm
                  title="¿Estás seguro que deseas cerrar sesión?"
                  onConfirm={() => logoutnUser()}
                >
                  <CustomButton
                    loading={isPending}
                    size="large"
                    type="text"
                    icon={<LogoutOutlined />}
                    style={{
                      color: 'white',
                    }}
                  ></CustomButton>
                </CustomConfirm>
              </Tooltip>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default Header
