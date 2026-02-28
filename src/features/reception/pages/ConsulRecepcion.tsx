import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Tag, Space, DatePicker, Row, Typography } from 'antd'
import CustomTable from '../../../components/table/CustomTable'
import { CustomTitle } from '../../../components/tittle/CustomTittle'
import { CustomButton } from '../../../components/Button/CustomButton'
import CustomIcons from '../../../components/icons/CustomIcon'
import CustomTooltip from '../../../components/tooltip/CustomTooltip'
import { useReception } from '../hooks/useReception'
import {
  PATH_REGISTER_RECEPCION,
  PATH_VIEW_RECEPCION,
} from '../../../routes/pathts'
import type { ReceptionDto } from '../dto-receptionDto'
import { getColumnSearchProps } from '../../../utils/serachColumns'

const { RangePicker } = DatePicker
const { Text } = Typography

const ConsulRecepcion = () => {
  const navigate = useNavigate()
  const { getReceptions, receptions, isPendingList } = useReception()
  const [filters, setFilters] = useState<any>({ estado: 'A' })

  useEffect(() => {
    getReceptions(filters)
  }, [getReceptions, filters])

  const handleDateChange = (dates: any) => {
    if (dates) {
      setFilters((prev: any) => ({
        ...prev,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD'),
      }))
    } else {
      const { start_date, end_date, ...rest } = filters
      setFilters(rest)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      width: '80px',
    },
    {
      title: 'Proveedor',
      key: 'proveedor',
      render: (record: ReceptionDto) =>
        record.proveedor?.entidad?.nombres || `ID: ${record.id_proveedor}`,
      ...getColumnSearchProps(['proveedor', 'entidad', 'nombres'], 'Proveedor'),
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (date: string) => date?.split('T')[0],
      sorter: (a: any, b: any) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    },
    {
      title: 'Tipo Pago',
      dataIndex: 'tipo_pago',
      key: 'tipo_pago',
      filters: [
        { text: 'CONTADO', value: 'CONTADO' },
        { text: 'CREDITO', value: 'CREDITO' },
      ],
      onFilter: (value: any, record: any) => record.tipo_pago === value,
    },
    {
      title: 'Monto Total',
      dataIndex: 'monto_total',
      key: 'monto_total',
      render: (monto: number) => (
        <Text strong>
          {new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
          }).format(monto || 0)}
        </Text>
      ),
    },
    {
      title: 'Saldo Pendiente',
      dataIndex: 'saldo_pendiente',
      key: 'saldo_pendiente',
      render: (monto: number) => (
        <Text type={monto > 0 ? 'danger' : 'success'}>
          {new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
          }).format(monto || 0)}
        </Text>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado_recepcion',
      key: 'estado_recepcion',
      render: (estado: string) => {
        let color = 'blue'
        if (estado === 'CERRADA') color = 'green'
        if (estado === 'ANULADA') color = 'red'
        return <Tag color={color}>{estado}</Tag>
      },
      filters: [
        { text: 'ABIERTA', value: 'ABIERTA' },
        { text: 'CERRADA', value: 'CERRADA' },
        { text: 'ANULADA', value: 'ANULADA' },
      ],
      onFilter: (value: any, record: any) => record.estado_recepcion === value,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (record: ReceptionDto) => (
        <Space>
          <CustomTooltip title="Ver Detalles">
            <CustomIcons.FileSearchOutlined
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() =>
                navigate(PATH_VIEW_RECEPCION, { state: { id: record.id } })
              }
            />
          </CustomTooltip>
          {record.estado_recepcion === 'ABIERTA' && (
            <CustomTooltip title="Editar">
              <CustomIcons.FormOutlined
                style={{ cursor: 'pointer', color: '#faad14' }}
                onClick={() =>
                  navigate(PATH_REGISTER_RECEPCION, {
                    state: { receptionData: record, edit: true },
                  })
                }
              />
            </CustomTooltip>
          )}
        </Space>
      ),
    },
  ]

  const title = () => (
    <Row justify="space-between" align="middle">
      <CustomTitle level={4} style={{ margin: 0 }}>
        Listado de Recepciones
      </CustomTitle>
      <Space>
        <RangePicker onChange={handleDateChange} />
        <CustomButton
          type="primary"
          icon={<CustomIcons.PlusOutlined />}
          onClick={() => navigate(PATH_REGISTER_RECEPCION)}
        >
          Nueva Recepción
        </CustomButton>
      </Space>
    </Row>
  )

  return (
    <Card>
      <CustomTitle level={2}>Gestión de Recepciones</CustomTitle>
      <CustomTable
        columns={columns}
        dataSource={receptions}
        loading={isPendingList}
        rowKey="id"
        title={title}
      />
    </Card>
  )
}

export default ConsulRecepcion
