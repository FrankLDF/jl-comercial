import { useEffect, useState } from 'react'
import {
  Form,
  Select,
  InputNumber,
  Divider,
  Row,
  Col,
  Card,
  Space,
  Table,
  Typography,
} from 'antd'
import { CustomTitle } from '../../../components/tittle/CustomTittle'
import { CustomForm } from '../../../components/form/CustomForm'
import { CustomButton } from '../../../components/Button/CustomButton'
import { useNavigate } from 'react-router-dom'
import { PATH_CONSULT_VENTA } from '../../../routes/pathts'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import ventaService from '../services/ventaService'
import clientService from '../../client/services/clientService'
import inventarioService from '../../inventario/services/inventarioService'
import { showNotification } from '../../../utils/showNotification'
import { showHandleError } from '../../../utils/handleError'
import type { CreateVentaDto } from '../dto-ventaDto'

const { Option } = Select
const { Text } = Typography

const RegisterVenta = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [clients, setClients] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [loadingLookups, setLoadingLookups] = useState(true)
  const [tipoPago, setTipoPago] = useState<'CONTADO' | 'CREDITO'>('CONTADO')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<any[]>([])
  const [editedPrices, setEditedPrices] = useState<Record<number, number>>({})

  const { mutate: createVenta, isPending: isSubmitting } = useCustomMutation({
    execute: ventaService.createVenta,
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: 'Venta registrada correctamente',
      })
      navigate(PATH_CONSULT_VENTA)
    },
    onError: (e) => showHandleError(e as never),
  })

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [clientsRes, inventoryRes] = await Promise.all([
          clientService.getClient({ estado: 'A' }),
          inventarioService.getInventario({
            estado_ingreso: 'EN_STOCK',
            estado: 'A',
          }),
        ])
        const clientsData = Array.isArray(clientsRes) ? clientsRes : clientsRes.data || []
        const inventoryData = Array.isArray(inventoryRes) ? inventoryRes : inventoryRes.data || []
        
        setClients(clientsData)
        setInventory(inventoryData)

        // Initialize edited prices with estimates
        const initialPrices: Record<number, number> = {}
        inventoryData.forEach((item: any) => {
          initialPrices[item.id] = item.precio_venta_estimado
        })
        setEditedPrices(initialPrices)
      } catch (error) {
        console.error('Error fetching lookups:', error)
      } finally {
        setLoadingLookups(false)
      }
    }
    fetchLookups()
  }, [])

  const onFinish = (values: any) => {
    if (selectedVehicles.length === 0) {
      showNotification({
        type: 'warning',
        message: 'Debe seleccionar al menos un vehículo',
      })
      return
    }

    const payload: CreateVentaDto = {
      id_cliente: values.id_cliente,
      tipo_pago: values.tipo_pago,
      detalles: selectedVehicles.map((v) => ({
        id_vehiculo_ingreso: v.id,
        precio_venta: editedPrices[v.id] || v.precio_venta_estimado,
      })),
    }

    if (values.tipo_pago === 'CREDITO') {
      payload.inicial = values.inicial || 0
      payload.cantidad_cuotas = values.cantidad_cuotas
      payload.tasa_interes = values.tasa_interes
    }

    createVenta(payload)
  }

  const handlePriceChange = (id: number, value: number | null) => {
    setEditedPrices(prev => ({
      ...prev,
      [id]: value || 0
    }))
  }

  const columns = [
    {
      title: 'Moto',
      key: 'moto',
      render: (record: any) => (
        <Text strong>
          {record.vehiculo?.marca_ref?.nombre} {record.vehiculo?.modelo_ref?.nombre}
        </Text>
      ),
    },
    {
      title: 'Año',
      dataIndex: ['vehiculo', 'anio'],
      key: 'anio',
    },
    {
      title: 'Precio Estimado',
      dataIndex: 'precio_venta_estimado',
      key: 'estimado',
      render: (val: number) => (
        <Text type="secondary">
          {new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
          }).format(val)}
        </Text>
      ),
    },
    {
      title: 'Precio Venta Final',
      key: 'precio_final',
      width: '200px',
      render: (record: any) => (
        <InputNumber
          style={{ width: '100%' }}
          value={editedPrices[record.id]}
          onChange={(val) => handlePriceChange(record.id, val)}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
        />
      ),
    },
  ]

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
    setSelectedVehicles(selectedRows)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const totalVenta = selectedVehicles.reduce(
    (acc, curr) => acc + (editedPrices[curr.id] || 0),
    0
  )

  return (
    <>
      <CustomTitle level={2}>Registrar Nueva Venta</CustomTitle>
      <Card loading={loadingLookups}>
        <CustomForm
          form={form}
          onFinish={onFinish}
          initialValues={{ tipo_pago: 'CONTADO', inicial: 0 }}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id_cliente"
                label="Cliente"
                rules={[{ required: true, message: 'Seleccione un cliente' }]}
              >
                <Select
                  showSearch
                  placeholder="Buscar cliente"
                  optionFilterProp="children"
                >
                  {clients.map((c) => (
                    <Option key={c.id} value={c.id}>
                      {c.entidad?.nombres} {c.entidad?.apellidos} (
                      {c.entidad?.documento_ident})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tipo_pago"
                label="Tipo de Pago"
                rules={[{ required: true }]}
              >
                <Select onChange={(val) => setTipoPago(val)}>
                  <Option value="CONTADO">CONTADO</Option>
                  <Option value="CREDITO">CREDITO</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Seleccionar Vehículos</Divider>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={inventory}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            footer={() => (
              <Row justify="end">
                <Col>
                  <Text style={{ fontSize: '16px' }}>
                    Total Venta: <Text strong style={{ fontSize: '18px', color: '#1677ff' }}>
                      {new Intl.NumberFormat('es-DO', {
                        style: 'currency',
                        currency: 'DOP',
                      }).format(totalVenta)}
                    </Text>
                  </Text>
                </Col>
              </Row>
            )}
          />

          {tipoPago === 'CREDITO' && (
            <>
              <Divider orientation="left">Condiciones de Crédito</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="inicial" label="Pago Inicial">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="cantidad_cuotas"
                    label="Cantidad de Cuotas"
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <InputNumber style={{ width: '100%' }} min={1} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="tasa_interes" label="Tasa de Interés (%)">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Row justify="end" style={{ marginTop: 24 }}>
            <Space>
              <CustomButton onClick={() => navigate(-1)} type="default">
                Atrás
              </CustomButton>
              <CustomButton loading={isSubmitting} htmlType="submit">
                Registrar Venta
              </CustomButton>
            </Space>
          </Row>
        </CustomForm>
      </Card>
    </>
  )
}

export default RegisterVenta
