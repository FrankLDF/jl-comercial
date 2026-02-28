import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import FormRecepcion from '../components/FormRecepcion'
import { useReception } from '../hooks/useReception'
import providerService from '../../provider/services/providerService'
import { PATH_CONSULT_RECEPCION } from '../../../routes/pathts'
import type { ReceptionDto } from '../dto-receptionDto'

const RegisterRecepcion = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const receptionData = location.state?.receptionData
  const isEdit = location.state?.edit
  
  const { 
    createReception, isPendingCreate, 
    getReceptionById, receptionDetail, isPendingDetail,
    getMarcas, marcas, isPendingMarcas,
    getModelos, modelos, isPendingModelos,
    getEstilos, estilos, isPendingEstilos,
    getColores, colores, isPendingColores
  } = useReception()
  const [providers, setProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(true)

  useEffect(() => {
    if (isEdit && receptionData?.id) {
      getReceptionById(receptionData.id)
    }
    getMarcas()
    getModelos(undefined as any)
    getEstilos(undefined as any)
    getColores()
  }, [isEdit, receptionData, getReceptionById, getMarcas, getModelos, getEstilos, getColores])

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await providerService.getProvider({ estado: 'A' })
        setProviders(data.data || [])
      } catch (error) {
        console.error('Error fetching providers:', error)
      } finally {
        setLoadingProviders(false)
      }
    }
    fetchProviders()
  }, [])

  const handleSubmit = (values: ReceptionDto) => {
    createReception(values)
  }

  if (loadingProviders || isPendingDetail || isPendingMarcas || isPendingModelos || isPendingEstilos || isPendingColores) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" tip="Cargando información..." />
      </div>
    )
  }

  const finalInitialValues = receptionDetail || receptionData

  return (
    <FormRecepcion
      initialValues={finalInitialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate(PATH_CONSULT_RECEPCION)}
      loading={isPendingCreate}
      readOnly={finalInitialValues && !isEdit}
      providers={providers}
      marcas={marcas}
      modelos={modelos}
      estilos={estilos}
      colores={colores}
    />
  )
}

export default RegisterRecepcion
