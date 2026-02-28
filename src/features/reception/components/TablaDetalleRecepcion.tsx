import React, { useState } from 'react'
import { Table, Button, Space, Popconfirm, Typography, Divider } from 'antd'
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import type {
  ReceptionDetailDto,
  DetalleRecepcionInput,
} from '../dto-receptionDto'
import ModalVehiculo from './ModalVehiculo'

const { Text } = Typography

interface TablaDetalleRecepcionProps {
  detalles: (ReceptionDetailDto | DetalleRecepcionInput)[]
  onChange: (detalles: (ReceptionDetailDto | DetalleRecepcionInput)[]) => void
  readOnly?: boolean
  marcas?: any[]
  modelos?: any[]
  estilos?: any[]
  colores?: any[]
}

const TablaDetalleRecepcion: React.FC<TablaDetalleRecepcionProps> = ({
  detalles,
  onChange,
  readOnly = false,
  marcas = [],
  modelos = [],
  estilos = [],
  colores = [],
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAdd = () => {
    setEditingIndex(null)
    setModalVisible(true)
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setModalVisible(true)
  }

  const handleSave = (values: DetalleRecepcionInput) => {
    const newDetalles = [...detalles]
    if (editingIndex !== null) {
      newDetalles[editingIndex] = values
    } else {
      newDetalles.push(values)
    }
    onChange(newDetalles)
    setModalVisible(false)
  }

  const handleRemove = (index: number) => {
    const newDetalles = detalles.filter((_, i) => i !== index)
    onChange(newDetalles)
  }

  const columns = [
    {
      title: 'Chasis',
      dataIndex: 'chasis',
      key: 'chasis',
      render: (_: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            {record.chasis ||
              record.vehiculo_ingreso?.vehiculo?.chasis ||
              record.vehiculo?.chasis ||
              'S/C'}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.condicion || record.vehiculo_ingreso?.condicion}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Información',
      key: 'info',
      render: (_: any, record: any) => {
        console.log(record)
        const brand =
          record.marca_nombre ||
          record.marca?.nombre ||
          record.vehiculo_ingreso?.vehiculo?.marca?.nombre ||
          record.vehiculo?.marca?.nombre ||
          marcas.find((m: any) => Number(m.id) === Number(record.id_marca))?.nombre ||
          ''
        const model =
          record.modelo_nombre ||
          record.modelo?.nombre ||
          record.vehiculo_ingreso?.vehiculo?.modelo?.nombre ||
          record.vehiculo?.modelo?.nombre ||
          modelos.find((m: any) => Number(m.id) === Number(record.id_modelo))?.nombre ||
          ''
        const style = 
          record.estilo_nombre ||
          record.estilo?.nombre ||
          record.vehiculo_ingreso?.vehiculo?.estilo?.nombre ||
          record.vehiculo?.estilo?.nombre ||
          estilos.find((e: any) => Number(e.id) === Number(record.id_estilo))?.nombre ||
          ''
        const color =
          record.color_nombre ||
          record.color?.nombre ||
          record.vehiculo_ingreso?.vehiculo?.color?.nombre ||
          record.vehiculo?.color?.nombre ||
          colores.find((c: any) => Number(c.id) === Number(record.id_color))?.nombre ||
          ''
        const anio =
          record.anio ||
          record.vehiculo_ingreso?.vehiculo?.anio ||
          record.vehiculo?.anio ||
          ''
        return (
          <Space direction="vertical" size={0}>
            <Text>
              {brand} {model} {anio ? `(${anio})` : ''} 
              {!brand && !model && (record.id_marca || record.id_modelo) && <Text type="danger" style={{ fontSize: '10px' }}>(ID Mar: {record.id_marca} Mod: {record.id_modelo})</Text>}
            </Text>
            <Space split={<Divider type="vertical" />} style={{ fontSize: '12px' }}>
              {style && <Text type="secondary">{style}</Text>}
              {color && <Text type="secondary">Color: {color}</Text>}
            </Space>
          </Space>
        )
      },
    },
    {
      title: 'Costo Unitario',
      dataIndex: 'costo_unitario',
      key: 'costo_unitario',
      render: (monto: number) =>
        new Intl.NumberFormat('es-DO', {
          style: 'currency',
          currency: 'DOP',
        }).format(monto || 0),
    },
    {
      title: 'Otros',
      dataIndex: 'otros_costos',
      key: 'otros_costos',
      render: (monto: number) =>
        new Intl.NumberFormat('es-DO', {
          style: 'currency',
          currency: 'DOP',
        }).format(monto || 0),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_: any, record: any) => {
        const total = Math.round((Number(record.costo_unitario || 0) + Number(record.otros_costos || 0)) * 100) / 100
        return (
          <Text strong>
            {new Intl.NumberFormat('es-DO', {
              style: 'currency',
              currency: 'DOP',
            }).format(total)}
          </Text>
        )
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '120px',
      render: (_: any, __: any, index: number) =>
        !readOnly && (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(index)}
            />
            <Popconfirm
              title="¿Eliminar?"
              onConfirm={() => handleRemove(index)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
    },
  ]

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Table
        dataSource={detalles}
        columns={columns}
        pagination={false}
        rowKey={(_, index = 0) => index.toString()}
        bordered
        footer={() =>
          !readOnly && (
            <Button
              type="dashed"
              onClick={handleAdd}
              block
              icon={<PlusOutlined />}
            >
              Agregar Motocicleta
            </Button>
          )
        }
      />

      <ModalVehiculo
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={
          editingIndex !== null
            ? (detalles[editingIndex] as DetalleRecepcionInput)
            : undefined
        }
      />
    </Space>
  )
}

export default TablaDetalleRecepcion
