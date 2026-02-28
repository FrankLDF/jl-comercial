export interface EntidadDto {
  id: number;
  nombre?: string; // Keep for compatibility if used elsewhere
  nombres?: string;
  apellidos?: string;
  rnc_cedula?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
}

export interface ProveedorDto {
  id: number;
  id_entidad: number;
  entidad: EntidadDto;
  estado: string;
}

// Core vehicle data from catalogs
export interface MarcaDto { id: number; nombre: string; }
export interface ModeloDto { id: number; nombre: string; id_marca: number; }
export interface EstiloDto { id: number; nombre: string; id_modelo: number; }
export interface ColorDto { id: number; nombre: string; }

export interface VehiculoDto {
  id: number;
  chasis: string;
  numero_maquina?: string;
  placa?: string;
  id_marca: number;
  id_modelo: number;
  id_estilo: number;
  id_color: number;
  anio: number;
  cilindraje?: number;
  marca?: MarcaDto;
  modelo?: ModeloDto;
  estilo?: EstiloDto;
  color?: ColorDto;
}

export interface VehiculoIngresoDto {
  id: number;
  id_vehiculo: number;
  vehiculo: VehiculoDto;
  condicion: 'NUEVO' | 'USADO';
  costo_compra: number;
  precio_venta_estimado: number;
  estado_ingreso: 'EN_STOCK' | 'VENDIDO';
}

export interface ReceptionDetailDto {
  id?: number;
  id_recepcion?: number;
  id_vehiculo_ingreso: number;
  costo_unitario: number;
  otros_costos: number;
  costo_total?: number;
  vehiculo_ingreso?: VehiculoIngresoDto;
}

// Input structure for creating/editing Details (Vehicle info)
export interface DetalleRecepcionInput {
  chasis: string;
  numero_maquina?: string;
  placa?: string;
  id_marca: number;
  id_modelo: number;
  id_estilo: number;
  id_color: number;
  anio: number;
  cilindraje?: number;
  condicion: 'NUEVO' | 'USADO';
  costo_unitario: number;
  precio_venta_estimado: number;
  otros_costos: number;
}

export interface CuentaPorPagarDto {
  id: number;
  id_proveedor: number;
  id_recepcion: number;
  monto_original: number;
  saldo_pendiente: number;
  estado_cxp: 'PENDIENTE' | 'PARCIAL' | 'PAGADA' | 'VENCIDA' | 'ANULADA';
  fecha_emision: string;
  fecha_vencimiento?: string;
}

export interface ReceptionDto {
  id?: number;
  id_proveedor: number;
  proveedor?: ProveedorDto;
  fecha?: string;
  tipo_pago: 'CONTADO' | 'CREDITO';
  monto_total?: number;
  inicial?: number; // Only for CREDITO
  saldo_pendiente?: number;
  estado_recepcion?: 'ABIERTA' | 'CERRADA' | 'ANULADA';
  usuario_insercion?: string;
  usuario_actualizacion?: string;
  detalles: (ReceptionDetailDto | DetalleRecepcionInput)[];
  cuenta_por_pagar?: CuentaPorPagarDto;
}
