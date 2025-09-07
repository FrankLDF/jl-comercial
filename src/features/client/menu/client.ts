import {
  PATH_CONSULT_CLIENT,
  PATH_REGISTER_CLIENT,
} from '../../../routes/pathts'
import { type AppMenuItem } from '../../../utils/constants'

export const client: AppMenuItem = {
  key: 'clientes',
  label: 'CLIENTES',
  children: [
    {
      key: PATH_CONSULT_CLIENT,
      label: 'CONSULTAR CLIENTE',
    },
    {
      key: PATH_REGISTER_CLIENT,
      label: 'REGISTRAR CLIENTE',
    },
  ],
}
