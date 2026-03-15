import type { InventarioDto } from '../inventario/dto-inventarioDto';
import type { ClientDto } from '../client/dto-clientDto';

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
}

export interface PagoDto {
  id: number;
  id_venta: number;
  monto_total: number;
  fecha_pago: string;
  metodo_pago?: string;
  usuario_insercion?: string;
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
}

export interface CreatePagoDto {
  id_venta: number;
  monto_total: number;
  metodo_pago?: string;
}
