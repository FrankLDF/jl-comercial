import { Form, InputNumber, Modal, Select } from 'antd'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import ventaService from '../services/ventaService'
import { showNotification } from '../../../utils/showNotification'
import { showHandleError } from '../../../utils/handleError'
import type { CreatePagoDto } from '../dto-ventaDto'

const { Option } = Select

interface PagoFormProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  idVenta: number
  saldoPendiente: number
}

const PagoForm = ({
  visible,
  onCancel,
  onSuccess,
  idVenta,
  saldoPendiente,
}: PagoFormProps) => {
  const [form] = Form.useForm()

  const { mutate: createPago, isPending } = useCustomMutation({
    execute: ventaService.createPago,
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: 'Pago registrado correctamente',
      })
      form.resetFields()
      onSuccess()
    },
    onError: (e) => showHandleError(e as never),
  })

  const onFinish = (values: any) => {
    const payload: CreatePagoDto = {
      id_venta: idVenta,
      monto_total: values.monto_total,
      metodo_pago: values.metodo_pago,
    }
    createPago(payload)
  }

  return (
    <Modal
      title="Registrar Pago"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText="Registrar"
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ metodo_pago: 'EFECTIVO' }}
      >
        <p>
          <strong>Saldo Pendiente:</strong> ${saldoPendiente.toLocaleString()}
        </p>
        <Form.Item
          name="monto_total"
          label="Monto a Pagar"
          rules={[
            { required: true, message: 'Ingrese el monto' },
            {
              validator: (_, value) => {
                if (value > saldoPendiente) {
                  return Promise.reject(
                    'El monto no puede superar el saldo pendiente'
                  )
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            max={saldoPendiente}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item name="metodo_pago" label="Método de Pago">
          <Select>
            <Option value="EFECTIVO">EFECTIVO</Option>
            <Option value="TRANSFERENCIA">TRANSFERENCIA</Option>
            <Option value="CHEQUE">CHEQUE</Option>
            <Option value="TARJETA">TARJETA</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PagoForm
