import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { getSessionInfo } from '../../utils/getSessionInfo'
import type { AppMenuItem } from '../../utils/constants'
import { client } from '../../features/client/menu/client'
import { filterMenuItemsByRole } from '../../utils/filterMenuByRol'
import { provider } from '../../features/provider/menu/provider'
import { inventory } from '../../features/inventario/menu/inventory'

export const Navbar = () => {
  const navigate = useNavigate()
  const session = getSessionInfo() || {}
  const userRoles = session.rols || []

  const handleClick: MenuProps['onClick'] = (e) => navigate(e.key)

  const items: AppMenuItem[] = [client, provider, inventory]
  const filteredItems: AppMenuItem[] = filterMenuItemsByRole(
    items as never,
    userRoles
  )

  return (
    <>
      <style>{`
        .wrap-menu .ant-menu-title-content{
          white-space: normal !important;
          word-break: break-word;
          overflow: visible !important;
          text-overflow: clip !important;
          line-height: 1.35;
        }
        .wrap-menu .ant-menu-item,
        .wrap-menu .ant-menu-submenu-title{
          height: auto !important;
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
      `}</style>

      <Menu
        mode="inline"
        rootClassName="wrap-menu"
        style={{ width: '100%' }}
        items={filteredItems}
        onClick={handleClick}
      />
    </>
  )
}
