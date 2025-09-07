export interface PaisDto {
  ID: string
  NOMBRE: string
  NACIONALIDAD: string
  ESTADO: string
  FECHA_INSERCION: Date
  USUARIO_INSERCION: string
  FECHA_ACTUALIZACION?: Date
  USUARIO_ACTUALIZACION?: string
}

export interface ProvinciaDto {
  ID: number
  ID_PAIS: string
  NOMBRE: string
  ESTADO: string
  FECHA_INSERCION: Date
  USUARIO_INSERCION: string
  FECHA_ACTUALIZACION?: Date
  USUARIO_ACTUALIZACION?: string
}

export interface MunicipioDto {
  ID: number
  ID_PROVINCIA: number
  NOMBRE: string
  ESTADO: string
  FECHA_INSERCION: Date
  USUARIO_INSERCION: string
  FECHA_ACTUALIZACION?: Date
  USUARIO_ACTUALIZACION?: string
}

export interface CiudadDto {
  ID: number
  ID_MUNICIPIO: number
  NOMBRE: string
  ESTADO: string
  FECHA_INSERCION: Date
  USUARIO_INSERCION: string
  FECHA_ACTUALIZACION?: Date
  USUARIO_ACTUALIZACION?: string
}

export interface EntidadDto {
  ID?: number
  TIPO_ENTIDAD?: string
  TIPO_DOC_IDENT?: number
  DOCUMENTO_IDENT?: string
  NOMBRES?: string
  APELLIDOS?: string
  SEXO?: string
  ESTADO_CIVIL?: string
  TELEFONO?: string
  TIPO_EMPELO?: string
  NOMBRE_EMPRESA_TRABAJO?: string
  OCUPACION?: string
  POSICION_EMPRESA?: string
  MONEDA_INGRESO?: string
  INGRESO_PROMEDIO?: string
  OTRO_INGRESO?: string
  RAZON_OTRO_INGRESO?: string
  EMAIL?: string
  ID_PAIS?: string
  ID_PROVINCIA?: number
  ID_MUNICIPIO?: number
  ID_CIUDAD?: number
  FECHA_NACIMIENTO?: Date
  ESTADO?: string
  FECHA_INSERCION?: Date
  USUARIO_INSERCION?: string
  FECHA_ACTUALIZACION?: Date
  USUARIO_ACTUALIZACION?: string
}
