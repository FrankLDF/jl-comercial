import {
  PATH_CONSULT_PROVEEDOR,
  PATH_REGISTER_PROVEEDOR,
} from '../../../routes/pathts'
import { type AppMenuItem } from '../../../utils/constants'

export const provider: AppMenuItem = {
  key: 'provider',
  label: 'PROVEEDORES',
  children: [
    {
      key: PATH_CONSULT_PROVEEDOR,
      label: 'CONSULTA PROVEEDOR',
    },
    {
      key: PATH_REGISTER_PROVEEDOR,
      label: 'REGISTRAR PROVEEDOR',
    },
  ],
}
