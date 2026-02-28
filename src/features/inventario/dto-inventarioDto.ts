export interface VehicleRefDto {
  id: number;
  nombre: string;
}

export interface InventarioVehiculoDto {
  id: number;
  chasis: string;
  placa?: string;
  anio: number;
  cilindraje?: number;
  marca_ref?: VehicleRefDto;
  modelo_ref?: VehicleRefDto;
  estilo_ref?: VehicleRefDto;
  color_ref?: VehicleRefDto;
}

export interface InventarioDto {
  id: number;
  id_vehiculo: number;
  condicion: 'NUEVO' | 'USADO';
  costo_compra: number;
  precio_venta_estimado: number;
  estado_ingreso: 'EN_STOCK' | 'VENDIDO';
  fecha_ingreso: string;
  estado: string;
  vehiculo: InventarioVehiculoDto;
}
