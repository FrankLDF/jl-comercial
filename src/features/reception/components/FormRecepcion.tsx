import React, { useEffect, useMemo } from 'react'
import {
  Form,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Divider,
  Typography,
  Space,
} from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { cleanReceptionData } from '../utils/receptionDataCleaner'
import type { ReceptionDto, ProveedorDto } from '../dto-receptionDto'
import TablaDetalleRecepcion from './TablaDetalleRecepcion'
import { getSessionInfo } from '../../../utils/getSessionInfo'

const { Title, Text } = Typography

interface FormRecepcionProps {
  initialValues?: Partial<ReceptionDto>
  onSubmit: (values: ReceptionDto) => void
  onCancel: () => void
  loading?: boolean
  readOnly?: boolean
  providers: ProveedorDto[]
  marcas?: any[]
  modelos?: any[]
  estilos?: any[]
  colores?: any[]
}

const FormRecepcion: React.FC<FormRecepcionProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading,
  readOnly = false,
  providers,
  marcas = [],
  modelos = [],
  estilos = [],
  colores = [],
}) => {
  const [form] = Form.useForm<ReceptionDto>()
  const session = getSessionInfo()

  const tipoPago = Form.useWatch('tipo_pago', form)
  const detalles = Form.useWatch('detalles', form) || []

  useEffect(() => {
    if (initialValues) {
      // Normalizar detalles si vienen del backend (ReceptionDetailDto)
      const normalizedDetalles = (initialValues.detalles || []).map((d: any) => {
        // Find vehicle data either nested (backend) or flat (freshly saved/temp)
        const v = d.vehiculo_ingreso?.vehiculo || d.vehiculo || d
        
        return {
          ...d,
          // Technical info
          chasis: v?.chasis || d.chasis || '',
          numero_maquina: v?.numero_maquina || d.numero_maquina || '',
          placa: v?.placa || d.placa || '',
          anio: Number(v?.anio || d.anio || 0),
          cilindraje: v?.cilindraje || d.cilindraje ? Number(v?.cilindraje || d.cilindraje) : undefined,
          
          // Catalog IDs
          id_marca: Number(v?.id_marca || d.id_marca || 0),
          id_modelo: Number(v?.id_modelo || d.id_modelo || 0),
          id_estilo: Number(v?.id_estilo || d.id_estilo || 0),
          id_color: Number(v?.id_color || d.id_color || 0),
          
          // Catalog Names (Crucial for display)
          marca_nombre: v?.marca?.nombre || d.marca_nombre || d.marca?.nombre || '',
          modelo_nombre: v?.modelo?.nombre || d.modelo_nombre || d.modelo?.nombre || '',
          estilo_nombre: v?.estilo?.nombre || d.estilo_nombre || d.estilo?.nombre || '',
          color_nombre: v?.color?.nombre || d.color_nombre || d.color?.nombre || '',
          
          // Transactional data
          condicion: d.vehiculo_ingreso?.condicion || d.condicion || 'NUEVO',
          costo_unitario: Number(d.costo_unitario || 0),
          precio_venta_estimado: Number(d.vehiculo_ingreso?.precio_venta_estimado || d.precio_venta_estimado || 0),
          otros_costos: Number(d.otros_costos || 0),
        }
      })
      console.log('Recepción inicializada con detalles normalizados:', normalizedDetalles)

      form.setFieldsValue({
        ...initialValues,
        detalles: normalizedDetalles,
        fecha: initialValues.fecha
          ? dayjs(initialValues.fecha)
          : (dayjs() as any),
        // @ts-ignore
        fecha_vencimiento: initialValues.cuenta_por_pagar?.fecha_vencimiento
          ? dayjs(initialValues.cuenta_por_pagar.fecha_vencimiento)
          : undefined,
      } as any)
    } else {
      form.setFieldsValue({
        tipo_pago: 'CONTADO',
        fecha: dayjs() as any,
        detalles: [],
      } as any)
    }
  }, [initialValues, form])

  const montoTotal = useMemo(() => {
    const total = detalles.reduce((acc, curr: any) => {
      const unit = Number(curr.costo_unitario || 0)
      const other = Number(curr.otros_costos || 0)
      return acc + unit + other
    }, 0)
    return Math.round(total * 100) / 100
  }, [detalles])

  useEffect(() => {
    form.setFieldValue('monto_total', montoTotal)
  }, [montoTotal, form])

  const handleFinish = (values: any) => {
    const formattedValues: any = {
      ...values,
      id: initialValues?.id, // Important: preserve ID for updates
      fecha: values.fecha?.format('YYYY-MM-DD'),
      fecha_vencimiento: values.fecha_vencimiento?.format('YYYY-MM-DD'),
      usuario_insercion: session?.nombre_usuario || 'admin',
      detalles: values.detalles.map((d: any) => ({
        ...d,
        // Ensure numeric types
        costo_unitario: Number(d.costo_unitario),
        precio_venta_estimado: Number(d.precio_venta_estimado),
        otros_costos: Number(d.otros_costos || 0),
        anio: Number(d.anio),
        cilindraje: Number(d.cilindraje),
      })),
    }

    // Clean data to avoid backend constraint errors (empty strings -> removed)
    const cleanedData = cleanReceptionData(formattedValues)
    onSubmit(cleanedData)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      disabled={readOnly || loading}
    >
      <Card
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                {initialValues?.id
                  ? `Editar Recepción #${initialValues.id}`
                  : 'Nueva Recepción'}
              </Title>
            </Col>
            <Col>
              <Space>
                <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
                  Volver
                </Button>
                {!readOnly && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                    disabled={detalles.length === 0}
                  >
                    Guardar Recepción
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        }
      >
        <Divider orientation="left">Información General</Divider>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="id_proveedor"
              label="Proveedor"
              rules={[{ required: true, message: 'Seleccione un proveedor' }]}
            >
              <Select
                showSearch
                placeholder="Seleccione un proveedor"
                optionFilterProp="children"
              >
                {providers.map((p: any) => (
                  <Select.Option key={p.id} value={Number(p.id)}>
                    {p.entidad?.nombres}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="tipo_pago"
              label="Tipo de Pago"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="CONTADO">CONTADO</Select.Option>
                <Select.Option value="CREDITO">CREDITO</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="fecha" label="Fecha" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        {tipoPago === 'CREDITO' && (
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="inicial"
                label="Monto Inicial (Pago hoy)"
                rules={[
                  { required: true, message: 'Ingrese el monto inicial' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) =>
                    (value
                      ? parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                      : 0) as 0
                  }
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="fecha_vencimiento"
                label="Fecha de Vencimiento"
                rules={[
                  {
                    required: true,
                    message: 'Seleccione fecha de vencimiento',
                  },
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Divider orientation="left">Agregar Motocicletas</Divider>
        <Form.Item name="detalles" valuePropName="detalles">
          <TablaDetalleRecepcion
            detalles={detalles}
            onChange={(newDetalles) =>
              form.setFieldValue('detalles', newDetalles)
            }
            readOnly={readOnly}
            marcas={marcas}
            modelos={modelos}
            estilos={estilos}
            colores={colores}
          />
        </Form.Item>

        <Divider />
        <Row justify="end">
          <Col>
            <Space direction="vertical" align="end">
              <Text strong style={{ fontSize: '18px' }}>
                Total:{' '}
                {new Intl.NumberFormat('es-DO', {
                  style: 'currency',
                  currency: 'DOP',
                }).format(montoTotal)}
              </Text>
              {tipoPago === 'CREDITO' && (
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Saldo Pendiente:{' '}
                  {new Intl.NumberFormat('es-DO', {
                    style: 'currency',
                    currency: 'DOP',
                  }).format(montoTotal - (form.getFieldValue('inicial') || 0))}
                </Text>
              )}
            </Space>
          </Col>
        </Row>
      </Card>
    </Form>
  )
}

export default FormRecepcion
