import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Spin,
  Result,
  Card,
  Row,
  Descriptions,
  Tag,
  Tabs,
  Table,
  Space,
  Popconfirm,
  Typography,
} from 'antd'
import { CustomTitle } from '../../../components/tittle/CustomTittle'
import { CustomButton } from '../../../components/Button/CustomButton'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import ventaService from '../services/ventaService'
import receptionService from '../../reception/services/receptionService'
import { PATH_CONSULT_VENTA } from '../../../routes/pathts'
import { showNotification } from '../../../utils/showNotification'
import { showHandleError } from '../../../utils/handleError'
import PagoForm from '../components/PagoForm'

const { Text } = Typography

const ViewVenta = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = location.state || {}

  const [isPagoModalVisible, setIsPagoModalVisible] = useState(false)
  const [marcas, setMarcas] = useState<any[]>([])
  const [modelos, setModelos] = useState<any[]>([])
  const [colores, setColores] = useState<any[]>([])
  const [estilos, setEstilos] = useState<any[]>([])

  const {
    mutate: getVenta,
    isPending,
    data,
  } = useCustomMutation({
    execute: ventaService.getVentaById,
    onError: (e) => showHandleError(e as never),
  })

  const { mutate: fetchMarcas } = useCustomMutation({
    execute: receptionService.getMarcas,
    onSuccess: (res) => setMarcas(res.data?.brands || res.brands || res || []),
  })

  const { mutate: fetchModelos } = useCustomMutation({
    execute: () => receptionService.getModelos(),
    onSuccess: (res) => setModelos(res.data?.models || res.models || res || []),
  })

  const { mutate: fetchColores } = useCustomMutation({
    execute: receptionService.getColores,
    onSuccess: (res) => setColores(res.data?.colors || res.colors || res || []),
  })

  const { mutate: fetchEstilos } = useCustomMutation({
    execute: () => receptionService.getEstilos(),
    onSuccess: (res) => setEstilos(res.data?.styles || res.styles || res || []),
  })

  const { mutate: cancelarVenta, isPending: isCancelling } = useCustomMutation({
    execute: ventaService.cancelarVenta,
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: 'Venta cancelada correctamente',
      })
      getVenta(id)
    },
    onError: (e) => showHandleError(e as never),
  })

  useEffect(() => {
    if (id) {
      getVenta(id)
      fetchMarcas()
      fetchModelos()
      fetchColores()
      fetchEstilos()
    }
  }, [id, getVenta, fetchMarcas, fetchModelos, fetchColores, fetchEstilos])

  if (!id) {
    return (
      <Result
        status="404"
        title="No se encontró la venta"
        extra={
          <CustomButton type="primary" onClick={() => navigate(PATH_CONSULT_VENTA)}>
            Volver al listado
          </CustomButton>
        }
      />
    )
  }

  const venta = data?.data
  if (isPending || !venta) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <Spin size="large" tip="Cargando detalles de la venta..." />
      </div>
    )
  }

  const isCancelable = (venta.estado_venta || venta.estado) === 'ACTIVA'
  const canPay = (venta.estado_venta || venta.estado) === 'ACTIVA' && venta.saldo_pendiente > 0

  return (
    <>
      <Row justify="space-between" align="middle">
        <CustomTitle level={2}>Detalle de Venta #{venta.id}</CustomTitle>
        <Space>
          <CustomButton onClick={() => navigate(-1)} type="default">
            Atrás
          </CustomButton>
          {canPay && (
            <CustomButton
              type="primary"
              onClick={() => setIsPagoModalVisible(true)}
            >
              Registrar Pago
            </CustomButton>
          )}
          {isCancelable && (
            <Popconfirm
              title="¿Está seguro de cancelar esta venta?"
              description="Esta acción liberará el vehículo al inventario y anulará cuotas pendientes."
              onConfirm={() => cancelarVenta(id)}
              okText="Sí, Cancelar"
              cancelText="No"
              okButtonProps={{ danger: true, loading: isCancelling }}
            >
              <CustomButton danger>Cancelar Venta</CustomButton>
            </Popconfirm>
          )}
        </Space>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Cliente">
            {venta.cliente?.entidad?.nombres} {venta.cliente?.entidad?.apellidos}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha">
            {(venta.fecha_venta || (venta as any).fecha)?.split('T')[0] || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            <Tag
              color={
                (venta.estado_venta || venta.estado) === 'ACTIVA'
                  ? 'blue'
                  : (venta.estado_venta || venta.estado) === 'PAGADA'
                  ? 'green'
                  : 'red'
              }
            >
              {venta.estado_venta || venta.estado}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tipo Pago">
            {venta.tipo_pago}
          </Descriptions.Item>
          <Descriptions.Item label="Monto Total">
            ${venta.monto_total?.toLocaleString() || '0'}
          </Descriptions.Item>
          <Descriptions.Item label="Saldo Pendiente">
            <strong>${venta.saldo_pendiente?.toLocaleString() || '0'}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Vehículos',
              children: (
                <Table
                  dataSource={venta.detalles || []}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    {
                      title: 'Moto',
                      render: (_, record) => {
                        const veh = record.vehiculo_ingreso?.vehiculo as any
                        const brand = veh?.marca_ref?.nombre || veh?.marca?.nombre || marcas.find((m: any) => Number(m.id) === Number(veh?.id_marca))?.nombre || veh?.id_marca || ''
                        const model = veh?.modelo_ref?.nombre || veh?.modelo?.nombre || modelos.find((m: any) => Number(m.id) === Number(veh?.id_modelo))?.nombre || veh?.id_modelo || ''
                        const style = veh?.estilo_ref?.nombre || veh?.estilo?.nombre || estilos.find((e: any) => Number(e.id) === Number(veh?.id_estilo))?.nombre || ''
                        
                        return (
                          <Space direction="vertical" size={0}>
                            <Text strong>{`${brand} ${model}`.trim() || 'N/A'}</Text>
                            {style && <Text type="secondary" style={{ fontSize: '12px' }}>Estilo: {style}</Text>}
                          </Space>
                        )
                      },
                    },
                    {
                      title: 'Año',
                      render: (_, record) => record.vehiculo_ingreso?.vehiculo?.anio,
                    },
                    {
                      title: 'Color',
                      render: (_, record) => {
                        const veh = record.vehiculo_ingreso?.vehiculo as any
                        return (
                          veh?.color_ref?.nombre || 
                          veh?.color?.nombre || 
                          colores.find((c: any) => Number(c.id) === Number(veh?.id_color))?.nombre || 
                          'N/A'
                        )
                      },
                    },
                    {
                      title: 'Chasis',
                      render: (_, record) => record.vehiculo_ingreso?.vehiculo?.chasis,
                    },
                    {
                      title: 'Precio Venta',
                      dataIndex: 'precio_venta',
                      render: (val) => `$${val?.toLocaleString() || '0'}`,
                    },
                  ]}
                />
              ),
            },
            {
              key: '2',
              label: 'Cuotas',
              children: (
                <Table
                  dataSource={venta.cuotas || []}
                  rowKey="id"
                  columns={[
                    { title: '#', dataIndex: 'numero_cuota' },
                    {
                      title: 'Vencimiento',
                      dataIndex: 'fecha_vencimiento',
                      render: (d) => d?.split('T')[0] || 'N/A',
                    },
                    {
                      title: 'Monto Cuota',
                      render: (_, record) => {
                        const amount = record.monto || record.monto_cuota || 0
                        return `$${amount.toLocaleString()}`
                      },
                    },
                    {
                      title: 'Pagado',
                      dataIndex: 'monto_pagado',
                      render: (val) => `$${val?.toLocaleString() || '0'}`,
                    },
                    {
                      title: 'Estado',
                      dataIndex: 'estado',
                      render: (e) => (
                        <Tag
                          color={
                            e === 'PENDIENTE'
                              ? 'orange'
                              : e === 'PAGADA'
                              ? 'green'
                              : 'red'
                          }
                        >
                          {e}
                        </Tag>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              key: '3',
              label: 'Pagos Realizados',
              children: (
                <Table
                  dataSource={venta.pagos || []}
                  rowKey="id"
                  columns={[
                    { title: 'Fecha', dataIndex: 'fecha_pago', render: (d) => d?.split('T')[0] || 'N/A' },
                    { title: 'Monto', dataIndex: 'monto_total', render: (val) => `$${val?.toLocaleString() || '0'}` },
                    { title: 'Método', dataIndex: 'metodo_pago' },
                    { title: 'Usuario', dataIndex: 'usuario_insercion' },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>

      <PagoForm
        visible={isPagoModalVisible}
        onCancel={() => setIsPagoModalVisible(false)}
        onSuccess={() => {
          setIsPagoModalVisible(false)
          getVenta(id)
        }}
        idVenta={id}
        saldoPendiente={venta.saldo_pendiente}
      />
    </>
  )
}

export default ViewVenta
