import { CustomTitle } from '../../../components/tittle/CustomTittle'
import { CustomForm } from '../../../components/form/CustomForm'
import {
  deleteNullValues,
  EstadoGeneral,
  formItemLayout,
} from '../../../utils/constants'
import GeneralEntityForm from '../../general/components/GeneralEntityForm'
import { CustomButton } from '../../../components/Button/CustomButton'
import { Form, Row } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import providerService from '../services/providerService'
import { showNotification } from '../../../utils/showNotification'
import { showHandleError } from '../../../utils/handleError'
import { useEffect } from 'react'
import { PATH_CONSULT_PROVEEDOR } from '../../../routes/pathts'
import type { ProviderDto } from '../dto-providerDto'

export const RegisterProvider = () => {
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()

  const { state } = location
  const { providerData, onlyView, edit } = state || {}

  useEffect(() => {
    if (providerData) {
      const { entidad, ...providerInfo } = providerData || {}
      form.setFieldsValue({ ...entidad, ...providerInfo })
    }
  }, [providerData, form])

  const { mutate: upsertProvider, isPending } = useCustomMutation({
    execute: providerService.upsertProvider,
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: `Proveedor ${edit ? 'actualizado' : 'creado'} correctamente`,
      })
      form.resetFields()
      navigate(PATH_CONSULT_PROVEEDOR)
    },
    onError: (e) => showHandleError(e as never),
  })

  const handleSave = (data: ProviderDto) => {
    const payload = deleteNullValues({
      id: providerData?.id,
      estado: EstadoGeneral.ACTIVO,
      entidad: {
        ...data,
        id: providerData?.entidad?.id,
        estado: EstadoGeneral.ACTIVO,
      },
    })

    upsertProvider(payload as ProviderDto)
  }

  const handleCancel = () => {
    form.resetFields()
    if (providerData) {
      const { entidad, ...providerInfo } = providerData || {}
      form.setFieldsValue({ ...entidad, ...providerInfo })
    }
  }

  return (
    <>
      <CustomTitle level={2}>
        {onlyView ? 'Detalles del' : edit ? 'Editar' : 'Registrar'} Proveedor
      </CustomTitle>
      <CustomForm
        form={form}
        onFinish={handleSave}
        initialValues={edit ? undefined : { tipo_entidad: 'F' }}
        labelWrap
        {...formItemLayout}
      >
        <GeneralEntityForm
          view={onlyView}
          form={form}
          edit={edit}
          isProvider={true}
        />

        <Row justify={'end'}>
          <CustomButton onClick={() => navigate(-1)} type="default">
            Atrás
          </CustomButton>
          {!onlyView && (
            <>
              <CustomButton danger htmlType="button" onClick={handleCancel}>
                Cancelar
              </CustomButton>
              <CustomButton loading={isPending} htmlType="submit">
                Guardar
              </CustomButton>
            </>
          )}
        </Row>
      </CustomForm>
    </>
  )
}

export default RegisterProvider
