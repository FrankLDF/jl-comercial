import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import RecepcionDetail from '../components/RecepcionDetail'
import { useReception } from '../hooks/useReception'
import { PATH_CONSULT_RECEPCION } from '../../../routes/pathts'
import { getSessionInfo } from '../../../utils/getSessionInfo'
import providerService from '../../provider/services/providerService'

const ViewRecepcion = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = location.state || {}
  
  const { 
    getReceptionById, 
    receptionDetail, 
    isPendingDetail,
    closeReception,
    isPendingClose,
    voidReception,
    isPendingVoid,
    getMarcas, marcas, isPendingMarcas,
    getModelos, modelos, isPendingModelos,
    getEstilos, estilos, isPendingEstilos,
    getColores, colores, isPendingColores
  } = useReception()

  const [providers, setProviders] = useState<any[]>([])
  const [loadingProviders, setLoadingProviders] = useState(true)

  useEffect(() => {
    if (id) {
      getReceptionById(id)
      getMarcas()
      getModelos(undefined as any)
      getEstilos(undefined as any)
      getColores()
    }
  }, [id, getReceptionById, getMarcas, getModelos, getEstilos, getColores])

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

  const handleClose = () => {
    const session = getSessionInfo()
    closeReception({ 
      id: Number(id), 
      usuario: session?.nombre_usuario || 'admin' 
    }, {
      onSuccess: () => getReceptionById(id)
    })
  }

  const handleVoid = () => {
    voidReception(id, {
      onSuccess: () => getReceptionById(id)
    })
  }

  if (!id) {
    return (
      <Result
        status="404"
        title="No se encontró la recepción"
        extra={<Button type="primary" onClick={() => navigate(PATH_CONSULT_RECEPCION)}>Volver al listado</Button>}
      />
    )
  }

  if (isPendingDetail || isPendingMarcas || isPendingModelos || isPendingEstilos || isPendingColores || loadingProviders) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" tip="Cargando información..." />
      </div>
    )
  }

  if (!receptionDetail) return null

  return (
    <RecepcionDetail
      reception={receptionDetail}
      onClose={handleClose}
      onVoid={handleVoid}
      onBack={() => navigate(PATH_CONSULT_RECEPCION)}
      loading={isPendingClose || isPendingVoid}
      marcas={marcas}
      modelos={modelos}
      estilos={estilos}
      colores={colores}
      providers={providers}
    />
  )
}

export default ViewRecepcion
