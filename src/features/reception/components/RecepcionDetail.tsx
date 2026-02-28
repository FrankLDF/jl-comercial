import React from 'react'
import { Card, Row, Col, Typography, Tag, Divider, Descriptions, Table, Space, Button, Popconfirm } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { ReceptionDto } from '../dto-receptionDto'
import { getSessionInfo } from '../../../utils/getSessionInfo'

const { Title, Text } = Typography

interface RecepcionDetailProps {
  reception: ReceptionDto
  onClose?: (usuario: string) => void
  onVoid?: () => void
  onBack: () => void
  loading?: boolean
  marcas?: any[]
  modelos?: any[]
  estilos?: any[]
  colores?: any[]
  providers?: any[]
}

const RecepcionDetail: React.FC<RecepcionDetailProps> = ({
  reception,
  onClose,
  onVoid,
  onBack,
  loading,
  marcas = [],
  modelos = [],
  estilos = [],
  colores = [],
  providers = [],
}) => {
  const session = getSessionInfo()
  const isAbierta = reception.estado_recepcion === 'ABIERTA'

  const columns = [
    {
      title: 'Chasis',
      key: 'chasis',
      render: (record: any) => (
        <Text strong>{record.vehiculo_ingreso?.vehiculo?.chasis || record.vehiculo?.chasis || 'S/C'}</Text>
      ),
    },
    {
      title: 'Marca / Modelo',
      key: 'marca_modelo',
      render: (record: any) => {
        const v = record.vehiculo_ingreso?.vehiculo || record.vehiculo
        const brand = v?.marca?.nombre || marcas.find((m: any) => Number(m.id) === Number(v?.id_marca))?.nombre || v?.id_marca || '---'
        const model = v?.modelo?.nombre || modelos.find((m: any) => Number(m.id) === Number(v?.id_modelo))?.nombre || v?.id_modelo || '---'
        const style = v?.estilo?.nombre || estilos.find((e: any) => Number(e.id) === Number(v?.id_estilo))?.nombre || v?.id_estilo || ''
        const color = v?.color?.nombre || colores.find((c: any) => Number(c.id) === Number(v?.id_color))?.nombre || v?.id_color || ''
        
        return (
          <Space direction="vertical" size={0}>
            <Text>{brand} {model} {v?.anio ? `(${v?.anio})` : ''}</Text>
            <Space split={<Divider type="vertical" />} style={{ fontSize: '11px' }}>
              {style && <Text type="secondary">{style}</Text>}
              {color && <Text type="secondary">Color: {color}</Text>}
            </Space>
          </Space>
        )
      },
    },
    {
      title: 'Condición',
      dataIndex: ['vehiculo_ingreso', 'condicion'],
      key: 'condicion',
      render: (cond: string) => <Tag color={cond === 'NUEVO' ? 'blue' : 'orange'}>{cond}</Tag>
    },
    {
      title: 'Costo Unitario',
      dataIndex: 'costo_unitario',
      render: (monto: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(monto || 0),
    },
    {
      title: 'Otros Costos',
      dataIndex: 'otros_costos',
      render: (monto: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(monto || 0),
    },
    {
      title: 'Costo Total',
      dataIndex: 'costo_total',
      render: (monto: number) => <Text strong>{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(monto || 0)}</Text>,
    },
  ]

  const handleClose = () => {
    if (onClose) {
      onClose(session?.nombre_usuario || 'admin')
    }
  }

  const getEstadoTag = (estado?: string) => {
    let color = 'blue'
    if (estado === 'CERRADA') color = 'green'
    if (estado === 'ANULADA') color = 'red'
    return <Tag color={color} style={{ fontSize: '14px', padding: '4px 12px' }}>{estado}</Tag>
  }

  const subtotal = Math.round((reception.detalles || []).reduce((acc, curr: any) => acc + Number(curr.costo_unitario || 0), 0) * 100) / 100
  const totalOtros = Math.round((reception.detalles || []).reduce((acc, curr: any) => acc + Number(curr.otros_costos || 0), 0) * 100) / 100

  return (
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onBack}>Volver</Button>
              <Title level={4} style={{ margin: 0 }}>Resumen de Recepción #{reception.id}</Title>
              {getEstadoTag(reception.estado_recepcion)}
            </Space>
          </Col>
          <Col>
            {isAbierta && (
              <Space>
                <Popconfirm
                  title="¿Estás seguro de cerrar esta recepción?"
                  description="Una vez cerrada, los vehículos entrarán a inventario y se generará la CxP si fue a crédito."
                  onConfirm={handleClose}
                  okText="Sí, Cerrar"
                  cancelText="No"
                >
                  <Button type="primary" icon={<CheckCircleOutlined />} loading={loading}>
                    Cerrar Recepción
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="¿Estás seguro de anular esta recepción?"
                  onConfirm={onVoid}
                  okText="Sí, Anular"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<CloseCircleOutlined />} loading={loading}>
                    Anular
                  </Button>
                </Popconfirm>
              </Space>
            )}
          </Col>
        </Row>
      }
    >
      <Row gutter={24}>
        <Col span={16}>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Proveedor">
              {reception.proveedor?.entidad?.nombres || 
               providers.find((p: any) => Number(p.id) === Number(reception.id_proveedor))?.entidad?.nombres ||
               `ID: ${reception.id_proveedor}`}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Pago">
              <Tag color={reception.tipo_pago === 'CREDITO' ? 'orange' : 'cyan'}>{reception.tipo_pago}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Fecha">{reception.fecha?.split('T')[0] || reception.fecha}</Descriptions.Item>
            {reception.tipo_pago === 'CREDITO' && (
              <>
                <Descriptions.Item label="Monto Inicial">{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(reception.inicial || 0)}</Descriptions.Item>
                <Descriptions.Item label="Saldo Pendiente"><Text type="danger">{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(reception.saldo_pendiente || 0)}</Text></Descriptions.Item>
                <Descriptions.Item label="Estado CxP"><Tag color="purple">{reception.cuenta_por_pagar?.estado_cxp || 'PENDIENTE'}</Tag></Descriptions.Item>
                <Descriptions.Item label="Vencimiento CxP">{reception.cuenta_por_pagar?.fecha_vencimiento?.split('T')[0] || '---'}</Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Col>
        <Col span={8}>
          <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
            <Row justify="space-between"><Col>Subtotal:</Col><Col>{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(subtotal)}</Col></Row>
            <Row justify="space-between"><Col>Otros Costos:</Col><Col>{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(totalOtros)}</Col></Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row justify="space-between"><Col><Text strong>Monto Total:</Text></Col><Col><Text strong style={{ fontSize: '18px' }}>{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(reception.monto_total || 0)}</Text></Col></Row>
          </div>
        </Col>
      </Row>

      <Divider orientation="left">Vehículos Ingresados</Divider>
      <Table
        columns={columns}
        dataSource={reception.detalles}
        pagination={false}
        rowKey="id"
        bordered
        size="small"
      />

      {reception.estado_recepcion === 'CERRADA' && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Tag color="success" style={{ padding: '10px 20px', fontSize: '16px' }}>
            <CheckCircleOutlined /> Recepción cerrada y procesada en inventario
          </Tag>
        </div>
      )}
    </Card>
  )
}

export default RecepcionDetail
