import { useEffect, useState } from 'react'
import { Card, Tag, Space, DatePicker, Row, Typography } from 'antd'
import CustomTable from '../../../components/table/CustomTable'
import { CustomTitle } from '../../../components/tittle/CustomTittle'
import CustomIcons from '../../../components/icons/CustomIcon'
import { getColumnSearchProps } from '../../../utils/serachColumns'
import inventarioService from '../services/inventarioService'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import { showHandleError } from '../../../utils/handleError'
import type { InventarioDto } from '../dto-inventarioDto'

const { RangePicker } = DatePicker
const { Text } = Typography

const ConsulInventario = () => {
  const [filters, setFilters] = useState<any>({ estado: 'A' })
  const [dataSource, setDataSource] = useState<InventarioDto[]>([])

  const { mutate: getInventario, isPending } = useCustomMutation({
    execute: inventarioService.getInventario,
    onSuccess: (res) => {
      // Handle both { data: [] } and directly []
      setDataSource(Array.isArray(res) ? res : res.data || [])
    },
    onError: (e) => showHandleError(e as never),
  })

  useEffect(() => {
    getInventario(filters)
  }, [filters])

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
    setFilters((prev: any) => ({
      ...prev,
      estado_ingreso: filtersTable.estado_ingreso ? filtersTable.estado_ingreso[0] : undefined,
      condicion: filtersTable.condicion ? filtersTable.condicion[0] : undefined,
    }))
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
      title: 'Chasis',
      key: 'chasis',
      render: (record: InventarioDto) => record.vehiculo?.chasis,
      ...getColumnSearchProps(['vehiculo', 'chasis'], 'Chasis'),
    },
    {
      title: 'Placa',
      key: 'placa',
      render: (record: InventarioDto) => record.vehiculo?.placa || 'N/A',
      ...getColumnSearchProps(['vehiculo', 'placa'], 'Placa'),
    },
    {
      title: 'Marca',
      key: 'marca',
      render: (record: InventarioDto) => record.vehiculo?.marca_ref?.nombre,
    },
    {
      title: 'Modelo',
      key: 'modelo',
      render: (record: InventarioDto) => record.vehiculo?.modelo_ref?.nombre,
    },
    {
      title: 'Año',
      key: 'anio',
      render: (record: InventarioDto) => record.vehiculo?.anio,
    },
    {
      title: 'Condición',
      dataIndex: 'condicion',
      key: 'condicion',
      filters: [
        { text: 'NUEVO', value: 'NUEVO' },
        { text: 'USADO', value: 'USADO' },
      ],
      filterMultiple: false,
    },
    {
      title: 'Precio Venta',
      dataIndex: 'precio_venta_estimado',
      key: 'precio_venta_estimado',
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
      title: 'Estado',
      dataIndex: 'estado_ingreso',
      key: 'estado_ingreso',
      render: (estado: string) => {
        let color = 'green'
        if (estado === 'VENDIDO') color = 'red'
        return <Tag color={color}>{estado?.replace('_', ' ')}</Tag>
      },
      filters: [
        { text: 'EN STOCK', value: 'EN_STOCK' },
        { text: 'VENDIDO', value: 'VENDIDO' },
      ],
      filterMultiple: false,
    },
    {
      title: 'Fecha Ingreso',
      dataIndex: 'fecha_ingreso',
      key: 'fecha_ingreso',
      render: (date: string) => date?.split('T')[0],
      sorter: (a: any, b: any) =>
        new Date(a.fecha_ingreso).getTime() - new Date(b.fecha_ingreso).getTime(),
    },
  ]

  const title = () => (
    <Row justify="space-between" align="middle">
      <CustomTitle level={4} style={{ margin: 0 }}>
        Inventario de Vehículos
      </CustomTitle>
      <Space>
        <RangePicker onChange={handleDateChange} />
        <CustomIcons.ReloadOutlined 
          style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }} 
          onClick={() => getInventario(filters)}
        />
      </Space>
    </Row>
  )

  return (
    <Card>
      <CustomTitle level={2}>Consulta de Inventario</CustomTitle>
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        loading={isPending}
        rowKey="id"
        title={title}
        onChange={handleTableChange}
      />
    </Card>
  )
}

export default ConsulInventario
