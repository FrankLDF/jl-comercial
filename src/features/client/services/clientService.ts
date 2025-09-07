import serverCore from '../../../interceptors/axiosInstance'
import type { ClientDto } from '../dto-clientDto'

class ClientService {
  getClient = async (data: ClientDto) => {
    const res = await serverCore.post(`/client/search`, data)
    return res.data
  }
  upsertClient = async (data: ClientDto) => {
    const res = await serverCore.post(`/client`, data)
    return res.data
  }
}

export default new ClientService()
