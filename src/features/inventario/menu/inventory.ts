import { type AppMenuItem } from '../../../utils/constants'

export const inventory: AppMenuItem = {
  key: 'inventory',
  label: 'INVENTARIO',
  children: [
    {
      key: 'consult_inventory',
      label: 'CNSULTA INVENTARIO',
    },
    {
      key: 'reception',
      label: 'RESEPCION',
    },
  ],
}
