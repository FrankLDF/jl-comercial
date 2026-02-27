import serverCore from '../../../interceptors/axiosInstance'
import type { ProviderDto } from '../dto-providerDto'

class ProviderService {
  getProvider = async (params?: any) => {
    const res = await serverCore.get(`/proveedor`, { params })
    return res.data
  }

  upsertProvider = async (data: ProviderDto) => {
    const res = await serverCore.post(`/proveedor`, data)
    return res.data
  }

  softDeleteProvider = async (id: number) => {
    const res = await serverCore.post(`/proveedor`, { id, estado: 'I' })
    return res.data
  }
}

export default new ProviderService()
