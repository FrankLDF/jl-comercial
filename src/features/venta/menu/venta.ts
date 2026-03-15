import {
  PATH_CONSULT_VENTA,
  PATH_REGISTER_VENTA,
} from '../../../routes/pathts'
import { type AppMenuItem } from '../../../utils/constants'

export const venta: AppMenuItem = {
  key: 'ventas',
  label: 'VENTAS',
  children: [
    {
      key: PATH_CONSULT_VENTA,
      label: 'CONSULTAR VENTAS',
    },
    {
      key: PATH_REGISTER_VENTA,
      label: 'REGISTRAR VENTA',
    },
  ],
}
