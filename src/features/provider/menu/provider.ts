import { type AppMenuItem } from '../../../utils/constants'

export const provider: AppMenuItem = {
  key: 'provider',
  label: 'PROVEEDORES',
  children: [
    {
      key: 'consult_provider',
      label: 'CNSULTA PROVEEDOR',
    },
    {
      key: 'regiter_provider',
      label: 'REGISTRA PROVEEDOR',
    },
  ],
}
