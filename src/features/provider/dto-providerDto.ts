import type { EntidadDto } from '../general/dto/generalDto'

export interface ProviderDto {
  id?: number
  id_entidad?: number
  estado?: string
  fecha_insercion?: Date
  usuario_insercion?: string
  fecha_actualizacion?: Date
  usuario_actualizacion?: string
  entidad?: EntidadDto
}
