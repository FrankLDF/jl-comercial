import serverCore from '../../../interceptors/axiosInstance'
import type { ClientDto } from '../dto-clientDto'

class ClientService {
  getClient = async (params?: any) => {
    const res = await serverCore.get(`/client`, { params })
    return res.data
  }

  upsertClient = async (data: ClientDto) => {
    const res = await serverCore.post(`/client`, data)
    return res.data
  }

  softDeleteClient = async (id: number) => {
    const res = await serverCore.post(`/client`, { id, estado: 'I' })
    return res.data
  }
}

export default new ClientService()
