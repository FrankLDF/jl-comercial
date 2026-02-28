import serverCore from '../../../interceptors/axiosInstance'
import type { InventarioDto } from '../dto-inventarioDto'

class InventarioService {
  getInventario = async (params?: any): Promise<{ data: InventarioDto[] }> => {
    const res = await serverCore.get(`/inventario`, { params })
    return res.data
  }
}

export default new InventarioService()
