import serverCore from '../../../interceptors/axiosInstance'
import type { ReceptionDto } from '../dto-receptionDto'

class ReceptionService {
  // --- Catalogs ---
  getMarcas = async () => {
    const res = await serverCore.get(`/core/marca`)
    return res.data
  }

  getModelos = async (id_marca?: number) => {
    const res = await serverCore.get(`/core/modelo`, { params: id_marca ? { id_marca } : {} })
    return res.data
  }

  getEstilos = async (id_modelo?: number) => {
    const res = await serverCore.get(`/core/estilo`, { params: id_modelo ? { id_modelo } : {} })
    return res.data
  }

  getColores = async () => {
    const res = await serverCore.get(`/core/color`)
    return res.data
  }

  // --- Reception Logic ---
  getReceptions = async (params?: any) => {
    const res = await serverCore.get(`/recepcion`, { params })
    return res.data
  }

  getReceptionById = async (id: number) => {
    const res = await serverCore.get(`/recepcion/${id}`)
    return res.data
  }

  createReception = async (data: ReceptionDto) => {
    const res = await serverCore.post(`/recepcion`, data)
    return res.data
  }

  // Assuming updates use the same endpoint or a specific one
  updateReception = async (data: ReceptionDto) => {
    const res = await serverCore.post(`/recepcion`, data)
    return res.data
  }

  closeReception = async (id: number, usuario_actualizacion: string) => {
    const res = await serverCore.post(`/recepcion/${id}/cerrar`, { usuario_actualizacion })
    return res.data
  }

  voidReception = async (id: number) => {
    const res = await serverCore.post(`/recepcion`, { id, estado_recepcion: 'ANULADA' })
    return res.data
  }

  getAvailableVehicles = async () => {
    // This endpoint is assumed based on the requirement to select available vehicles
    const res = await serverCore.get(`/vehiculo-ingreso/disponible`)
    return res.data
  }
}

export default new ReceptionService()
