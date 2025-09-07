import type { ItemType } from 'antd/es/menu/interface'

export type MenuItem = ItemType & {
  key: string
  label: string
  requiredRols?: number[]
  children?: MenuItem[]
}

const hasAccess = (userRoles: number[], itemRols?: number[]): boolean => {
  if (!itemRols || itemRols.length === 0) return true
  return itemRols.some((r) => userRoles.includes(r))
}

export const filterMenuItemsByRole = (
  items: MenuItem[],
  userRoles: number[]
): MenuItem[] => {
  return items
    .map((item) => {
      if (!hasAccess(userRoles, item.requiredRols)) return null

      const filteredChildren = item.children
        ? filterMenuItemsByRole(item.children, userRoles)
        : undefined

      if (filteredChildren && filteredChildren.length > 0) {
        return { ...item, children: filteredChildren }
      }

      if (!item.children) {
        return item
      }

      return null
    })
    .filter(Boolean) as MenuItem[]
}
