import { type AppMenuItem } from '../../../utils/constants'
import { PATH_CONSULT_RECEPCION, PATH_CONSULT_INVENTARIO } from '../../../routes/pathts'

export const inventory: AppMenuItem = {
  key: 'inventory',
  label: 'INVENTARIO',
  children: [
    {
      key: PATH_CONSULT_INVENTARIO,
      label: 'CONSULTA INVENTARIO',
    },
    {
      key: PATH_CONSULT_RECEPCION,
      label: 'RECEPCIÓN',
    },
  ],
}
