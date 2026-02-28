import { useNavigate } from 'react-router-dom'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import receptionService from '../services/receptionService'
import { showHandleError } from '../../../utils/handleError'
import { showNotification } from '../../../utils/showNotification'
import { PATH_CONSULT_RECEPCION } from '../../../routes/pathts'

export const useReception = () => {
  const navigate = useNavigate()

  // --- Catalogs Mutations ---
  const marcasMutation = useCustomMutation({
    execute: receptionService.getMarcas,
    onError: (e) => showHandleError(e as never),
  })

  const modelosMutation = useCustomMutation({
    execute: receptionService.getModelos,
    onError: (e) => showHandleError(e as never),
  })

  const estilosMutation = useCustomMutation({
    execute: receptionService.getEstilos,
    onError: (e) => showHandleError(e as never),
  })

  const coloresMutation = useCustomMutation({
    execute: receptionService.getColores,
    onError: (e) => showHandleError(e as never),
  })

  // --- Reception Logic ---
  const listMutation = useCustomMutation({
    execute: receptionService.getReceptions,
    onError: (e) => showHandleError(e as never),
  })

  const getByIdMutation = useCustomMutation({
    execute: receptionService.getReceptionById,
    onError: (e) => showHandleError(e as never),
  })

  const createMutation = useCustomMutation({
    execute: (data: any) => 
      data.id 
        ? receptionService.updateReception(data) 
        : receptionService.createReception(data),
    onSuccess: (_, variables) => {
      showNotification({
        type: 'success',
        message: `Recepción ${variables.id ? 'actualizada' : 'creada'} correctamente`,
      })
      navigate(PATH_CONSULT_RECEPCION)
    },
    onError: (e) => showHandleError(e as never),
  })

  const closeMutation = useCustomMutation({
    execute: (args: { id: number; usuario: string }) => 
      receptionService.closeReception(args.id, args.usuario),
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: 'Recepción cerrada correctamente y vinculada a inventario',
      })
    },
    onError: (e) => showHandleError(e as never),
  })

  const voidMutation = useCustomMutation({
    execute: receptionService.voidReception,
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: 'Recepción anulada correctamente',
      })
    },
    onError: (e) => showHandleError(e as never),
  })

  return {
    getMarcas: marcasMutation.mutate,
    marcas: marcasMutation.data?.data?.brands || marcasMutation.data?.brands || [],
    isPendingMarcas: marcasMutation.isPending,

    getModelos: modelosMutation.mutate,
    modelos: modelosMutation.data?.data?.models || modelosMutation.data?.models || [],
    isPendingModelos: modelosMutation.isPending,

    getEstilos: estilosMutation.mutate,
    estilos: estilosMutation.data?.data?.styles || estilosMutation.data?.styles || [],
    isPendingEstilos: estilosMutation.isPending,

    getColores: coloresMutation.mutate,
    colores: coloresMutation.data?.data?.colors || coloresMutation.data?.colors || [],
    isPendingColores: coloresMutation.isPending,

    getReceptions: listMutation.mutate,
    receptions: listMutation.data?.data || listMutation.data || [],
    isPendingList: listMutation.isPending,

    getReceptionById: getByIdMutation.mutate,
    receptionDetail: getByIdMutation.data?.data || getByIdMutation.data,
    isPendingDetail: getByIdMutation.isPending,

    createReception: createMutation.mutate,
    isPendingCreate: createMutation.isPending,

    closeReception: closeMutation.mutate,
    isPendingClose: closeMutation.isPending,

    voidReception: voidMutation.mutate,
    isPendingVoid: voidMutation.isPending,
  }
}
