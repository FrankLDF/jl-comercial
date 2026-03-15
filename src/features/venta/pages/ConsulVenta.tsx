import { useEffect, useState } from 'react'
import CustomTable from '../../../components/table/CustomTable'
import { CustomTitle } from '../../../components/tittle/CustomTittle'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import { showHandleError } from '../../../utils/handleError'
import ventaService from '../services/ventaService'
import type { VentaDto } from '../dto-ventaDto'
import { DatePicker, Row, Space, Tag } from 'antd'
import { CustomButton } from '../../../components/Button/CustomButton'
import { useNavigate } from 'react-router-dom'
import { PATH_REGISTER_VENTA, PATH_VIEW_VENTA } from '../../../routes/pathts'
import CustomIcons from '../../../components/icons/CustomIcon'
import CustomTooltip from '../../../components/tooltip/CustomTooltip'
import { getColumnSearchProps } from '../../../utils/serachColumns'

const { RangePicker } = DatePicker

const ConsulVenta = () => {
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState<VentaDto[]>([])
  const [filters, setFilters] = useState<any>({ estado: 'ACTIVA' })

  const {
    mutate: getVentas,
    isPending,
    data,
  } = useCustomMutation({
    execute: ventaService.getVentas,
    onError: (e) => showHandleError(e as never),
  })

  useEffect(() => {
    getVentas({ ...filters })
  }, [getVentas, filters])

  useEffect(() => {
    if (data?.data) {
      setDataSource(data.data)
    }
  }, [data])

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

  const handleTableChange = (_pagination: any, filtersTable: any) => {
    if (filtersTable.estado) {
      setFilters((prev: any) => ({
        ...prev,
        estado: filtersTable.estado[0],
      }))
    } else {
      const { estado, ...rest } = filters
      setFilters(rest)
    }
  }

  const columns = [
    {
      title: 'No. Venta',
      dataIndex: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      ...getColumnSearchProps('id', 'No. Venta'),
    },
    {
      title: 'Fecha',
      key: 'fecha_venta',
      render: (record: VentaDto) => {
        const date = record.fecha_venta || (record as any).fecha
        return date?.toString().split('T')[0] || 'N/A'
      },
      sorter: (a: any, b: any) => {
        const dateA = a.fecha_venta || a.fecha
        const dateB = b.fecha_venta || b.fecha
        return new Date(dateA).getTime() - new Date(dateB).getTime()
      },
    },
    {
      title: 'Cliente',
      dataIndex: ['cliente', 'entidad', 'nombres'],
      render: (_: any, record: VentaDto) => {
        const nombres = record.cliente?.entidad?.nombres || ''
        const apellidos = record.cliente?.entidad?.apellidos || ''
        return `${nombres} ${apellidos}`
      },
      ...getColumnSearchProps(['cliente', 'entidad', 'nombres'], 'Cliente'),
    },
    {
      title: 'Tipo Pago',
      dataIndex: 'tipo_pago',
      filters: [
        { text: 'CONTADO', value: 'CONTADO' },
        { text: 'CREDITO', value: 'CREDITO' },
      ],
      onFilter: (value: any, record: any) => record.tipo_pago === value,
    },
    {
      title: 'Monto Total',
      dataIndex: 'monto_total',
      render: (monto: number) => `$${monto?.toLocaleString() || '0'}`,
    },
    {
      title: 'Saldo Pendiente',
      dataIndex: 'saldo_pendiente',
      render: (monto: number) => `$${monto?.toLocaleString() || '0'}`,
    },
    {
      title: 'Estado',
      dataIndex: 'estado_venta',
      render: (estado: string) => {
        let color = 'blue'
        if (estado === 'PAGADA') color = 'green'
        if (estado === 'CANCELADA') color = 'red'
        return <Tag color={color}>{estado || 'N/A'}</Tag>
      },
      filters: [
        { text: 'ACTIVA', value: 'ACTIVA' },
        { text: 'PAGADA', value: 'PAGADA' },
        { text: 'CANCELADA', value: 'CANCELADA' },
      ],
      filteredValue: filters.estado ? [filters.estado] : null,
      filterMultiple: false,
    },
    {
      title: 'Acciones',
      render: (record: VentaDto) => (
        <Space size="middle">
          <CustomTooltip title="Ver Detalles">
            <CustomIcons.FileSearchOutlined
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() => {
                navigate(PATH_VIEW_VENTA, {
                  state: { id: record.id },
                })
              }}
            />
          </CustomTooltip>
        </Space>
      ),
    },
  ]

  const title = () => (
    <Row justify={'space-between'} align="middle">
      <CustomTitle level={4}>Ventas Registradas</CustomTitle>
      <Space>
        <RangePicker onChange={handleDateChange} />
        <CustomButton
          icon={<CustomIcons.PlusCircleOutlined />}
          onClick={() => navigate(PATH_REGISTER_VENTA)}
          size="small"
          type="primary"
        >
          Nueva Venta
        </CustomButton>
      </Space>
    </Row>
  )

  return (
    <>
      <CustomTitle level={2}>Gestión de Ventas</CustomTitle>
      <CustomTable
        rowKey={(record: VentaDto) => record.id}
        title={title}
        columns={columns}
        dataSource={dataSource}
        loading={isPending}
        onChange={handleTableChange}
      />
    </>
  )
}

export default ConsulVenta
