import type { EntidadDto } from '../general/dto/generalDto'

// export interface ClientDto extends EntidadDto {
export interface ClientDto {
  ID?: number
  ID_ENTIDAD?: number
  ESTADO?: string
  FECHA_INSERCION?: Date
  USUARIO_INSERCION?: string
  FECHA_ACTUALIZACION?: Date
  USUARIO_ACTUALIZACION?: string
  ENTIDAD?: EntidadDto
}
