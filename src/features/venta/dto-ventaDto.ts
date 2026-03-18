import type { InventarioDto } from '../inventario/dto-inventarioDto';
import type { ClientDto } from '../client/dto-clientDto';

export interface CargoTipoDto {
  id: number;
  nombre: string;
  monto_sugerido: number;
  es_editable: boolean;
  es_vinculante: boolean;
}

export interface CargoVentaDto {
  id: number;
  id_venta: number;
  id_cargo_tipo: number;
  nombre: string;
  monto_total: number;
  monto_pagado: number;
  saldo_pendiente: number;
  estado: 'PENDIENTE' | 'PAGADO';
  es_vinculante: boolean;
}

export interface PagoDistribucionDto {
  tipo: 'CUOTA' | 'CARGO';
  id_referencia: number;
  monto: number;
  monto_mora?: number;
}

export interface DetalleVentaDto {
  id?: number;
  id_venta?: number;
  id_vehiculo_ingreso: number;
  precio_venta: number;
  vehiculo_ingreso?: InventarioDto;
}

export interface CuotaDto {
  id: number;
  id_venta: number;
  numero_cuota: number;
  monto: number;
  monto_cuota: number;
  fecha_vencimiento: string;
  estado: 'PENDIENTE' | 'PAGADA' | 'ATRASADA' | 'ANULADA';
  monto_pagado: number;
  mora_calculada: number;
  mora_pagada: number;
  mora_condonada: number;
}

export interface PagoDto {
  id: number;
  id_venta: number;
  monto_total: number;
  fecha_pago: string;
  metodo_pago?: string;
  usuario_insercion?: string;
  descripcion?: string;
  detalles: PagoDistribucionDto[];
}

export interface VentaDto {
  id: number;
  id_cliente: number;
  fecha_venta: string;
  tipo_pago: 'CONTADO' | 'CREDITO';
  monto_total: number;
  inicial: number;
  tasa_interes?: number;
  cantidad_cuotas?: number;
  saldo_pendiente: number;
  estado: 'ACTIVA' | 'PAGADA' | 'CANCELADA';
  estado_venta?: string;
  cliente?: ClientDto;
  detalles?: DetalleVentaDto[];
  cuotas?: CuotaDto[];
  pagos?: PagoDto[];
  cargos?: CargoVentaDto[];
}

export interface CreateVentaDto {
  id_cliente: number;
  tipo_pago: 'CONTADO' | 'CREDITO';
  inicial?: number;
  tasa_interes?: number;
  cantidad_cuotas?: number;
  detalles: {
    id_vehiculo_ingreso: number;
    precio_venta: number;
  }[];
  cargos: {
    id_cargo_tipo: number;
    monto: number;
  }[];
}

export interface CreatePagoDto {
  id_venta: number;
  monto_total: number;
  metodo_pago?: string;
  descripcion?: string;
  distribucion: PagoDistribucionDto[];
}
