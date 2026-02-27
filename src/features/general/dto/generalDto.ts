export interface PaisDto {
  id: string
  nombre: string
  nacionalidad: string
  estado: string
  fecha_insercion: Date
  usuario_insercion: string
  fecha_actualizacion?: Date
  usuario_actualizacion?: string
}

export interface ProvinciaDto {
  id: number
  id_pais: string
  nombre: string
  estado: string
  fecha_insercion: Date
  usuario_insercion: string
  fecha_actualizacion?: Date
  usuario_actualizacion?: string
}

export interface MunicipioDto {
  id: number
  id_provincia: number
  nombre: string
  estado: string
  fecha_insercion: Date
  usuario_insercion: string
  fecha_actualizacion?: Date
  usuario_actualizacion?: string
}

export interface CiudadDto {
  id: number
  id_municipio: number
  nombre: string
  estado: string
  fecha_insercion: Date
  usuario_insercion: string
  fecha_actualizacion?: Date
  usuario_actualizacion?: string
}

export interface EntidadDto {
  id?: number
  tipo_entidad?: string
  tipo_doc_ident?: number
  documento_ident?: string
  nombres?: string
  apellidos?: string
  sexo?: string
  estado_civil?: string
  telefono?: string
  tipo_empleo?: string
  nombre_empresa_trabajo?: string
  ocupacion?: string
  posicion_empresa?: string
  moneda_ingreso?: string
  ingreso_promedio?: string
  otro_ingreso?: string
  razon_otro_ingreso?: string
  email?: string
  id_pais?: string
  id_provincia?: number
  id_municipio?: number
  id_ciudad?: number
  desc_direccion?: string
  fecha_nacimiento?: Date
  estado?: string
  fecha_insercion?: Date
  usuario_insercion?: string
  fecha_actualizacion?: Date
  usuario_actualizacion?: string
}
