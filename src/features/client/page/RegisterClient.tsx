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
import type { ClientDto } from '../dto-clientDto'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import clientService from '../services/clientService'
import { showNotification } from '../../../utils/showNotification'
import { showHandleError } from '../../../utils/handleError'
import { useEffect } from 'react'
import { PATH_CONSULT_CLIENT } from '../../../routes/pathts'

export const RegisterClient = () => {
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()

  const { state } = location
  const { clientData, onlyView, edit } = state || {}

  useEffect(() => {
    if (clientData) {
      const { ENTIDAD, ...clientInfo } = clientData || {}
      form.setFieldsValue({ ...ENTIDAD, ...clientInfo })
    }
  }, [clientData, form])

  const { mutate: upsertClient, isPending } = useCustomMutation({
    execute: clientService.upsertClient,
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: `Cliente ${edit ? 'actualizado' : 'creado'} correctamente`,
      })
      form.resetFields()
      navigate(PATH_CONSULT_CLIENT)
    },
    onError: (e) => showHandleError(e as never),
  })

  const handleSave = (data: ClientDto) => {
    const payload = deleteNullValues({
      ID: clientData?.ID,
      ESTADO: EstadoGeneral.ACTIVO,
      ENTIDAD: {
        ...data,
        ID: clientData?.ENTIDAD?.ID,
        ESTADO: EstadoGeneral.ACTIVO,
      },
    })

    upsertClient(payload as ClientDto)
  }

  const handleCancel = () => {
    form.resetFields()
    if (clientData) {
      const { ENTIDAD, ...clientInfo } = clientData || {}
      form.setFieldsValue({ ...ENTIDAD, ...clientInfo })
    }
  }

  return (
    <>
      <CustomTitle level={2}>
        {onlyView ? 'Detalles del' : edit ? 'Editar' : 'Registrar'} Cliente
      </CustomTitle>
      <CustomForm
        form={form}
        onFinish={handleSave}
        initialValues={edit ? undefined : { TIPO_ENTIDAD: 'F' }}
        labelWrap
        {...formItemLayout}
      >
        <GeneralEntityForm view={onlyView} form={form} />

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
