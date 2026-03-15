import serverCore from '../../../interceptors/axiosInstance';
import type { CreatePagoDto, CreateVentaDto, CuotaDto, PagoDto, VentaDto } from '../dto-ventaDto';

class VentaService {
  getVentas = async (params?: any): Promise<{ data: VentaDto[] }> => {
    const res = await serverCore.get(`/venta`, { params });
    return res.data;
  };

  getVentaById = async (id: number): Promise<{ data: VentaDto }> => {
    const res = await serverCore.get(`/venta/${id}`);
    return res.data;
  };

  getCuotas = async (id: number): Promise<{ data: CuotaDto[] }> => {
    const res = await serverCore.get(`/venta/${id}/cuotas`);
    return res.data;
  };

  getPagos = async (id: number): Promise<{ data: PagoDto[] }> => {
    const res = await serverCore.get(`/venta/${id}/pagos`);
    return res.data;
  };

  createVenta = async (data: CreateVentaDto) => {
    const res = await serverCore.post(`/venta`, data);
    return res.data;
  };

  createPago = async (data: CreatePagoDto) => {
    const res = await serverCore.post(`/venta/pagos`, data);
    return res.data;
  };

  cancelarVenta = async (id: number) => {
    const res = await serverCore.patch(`/venta/${id}/cancelar`);
    return res.data;
  };
}

export default new VentaService();
