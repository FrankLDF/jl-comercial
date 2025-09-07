import serverCore from '../../../interceptors/axiosInstance'

class GeneralService {
  getCountry = async () => {
    const res = await serverCore.get(`/core/country`)
    return res.data
  }
  getProvince = async () => {
    const res = await serverCore.get(`/core/province`)
    return res.data
  }
  getMunicipio = async () => {
    const res = await serverCore.get(`/core/municipe`)
    return res.data
  }
  getSector = async () => {
    const res = await serverCore.get(`/core/sector`)
    return res.data
  }
}

export default new GeneralService()
