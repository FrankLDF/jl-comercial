import type { ItemType } from 'antd/es/menu/interface'

export const myPrimaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#1691f5ff'

export const Rol = {
  ADMIN: 1,
}

export type AppMenuItem = ItemType & {
  requiredRols?: number[]
  children?: AppMenuItem[]
}

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
}

export const TipoEntidad = {
  FISICA: 'F',
  EMPRESA: 'E',
}

export const Sexo = {
  Masculino: 'F',
  Femenino: 'E',
}

export const Moneda = {
  Dolar: 'US',
  Peso: 'RD',
  Euro: 'EUR',
}

export const EstadoGeneral = {
  ACTIVO: 'A',
  INACTIVO: 'I',
  Euro: 'EUR',
}

export const TipoDocIdent = {
  Cedula: 1,
  Rnc: 2,
  Pasaporte: 3,
}

export const NameTipoDocIdent = {
  1: 'Cedula',
  2: 'Rnc',
  3: 'Pasaporte',
}

export const EstadoCivil = [
  { valor: 'S', descripcion: 'Soltero/a' },
  { valor: 'C', descripcion: 'Casado/a' },
  { valor: 'D', descripcion: 'Divorciado/a' },
  { valor: 'V', descripcion: 'Viudo/a' },
  { valor: 'U', descripcion: 'Unión Libre' },
  { valor: 'O', descripcion: 'Otro' },
]

export const TipoEmpleo = [
  { valor: 'PRIV', descripcion: 'PRIVADO' },
  { valor: 'PUB', descripcion: 'PUBLICO' },
  { valor: 'IND', descripcion: 'INDEPENDIENTE' },
]

// export const deleteNullValues = <Type>(data: Type): Type => {
//   const mainData: {
//     [k: string]: Type
//   } = Object.fromEntries<Type>(
//     Object.entries(data).filter(
//       (value) => value[1] !== null && value[1] !== undefined
//     )
//   )
//   return mainData as Type
// }

export const deleteNullValues = (data: object) => {
  const responseData: Record<string, unknown> = Object.fromEntries(
    Object.entries(data).filter(
      (value) => value[1] !== null && value[1] !== undefined
    )
  )
  return responseData
}

// dayjs(dayjs().format(client?.FECHA_NAC), dateFormat),
