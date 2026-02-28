import { useEffect, useState } from 'react'
import CustomTable from '../../../components/table/CustomTable'
import { CustomTitle } from '../../../components/tittle/CustomTittle'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import { showHandleError } from '../../../utils/handleError'
import clientService from '../services/clientService'
import type { ClientDto } from '../dto-clientDto'
import { NameTipoDocIdent, EstadoGeneral } from '../../../utils/constants'
import { DatePicker, Popconfirm, Row, Space, Tag } from 'antd'
import { CustomButton } from '../../../components/Button/CustomButton'
import { useNavigate } from 'react-router-dom'
import { PATH_REGISTER_CLIENT } from '../../../routes/pathts'
import CustomIcons from '../../../components/icons/CustomIcon'
import CustomTooltip from '../../../components/tooltip/CustomTooltip'
import { getColumnSearchProps } from '../../../utils/serachColumns'
import { showNotification } from '../../../utils/showNotification'

const { RangePicker } = DatePicker

const ConsulClient = () => {
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState()
  const [filters, setFilters] = useState<any>({ estado: 'A' })

  const {
    mutate: getClients,
    isPending,
    data,
  } = useCustomMutation({
    execute: clientService.getClient,
    onError: (e) => showHandleError(e as never),
  })

  const { mutate: deleteClient } = useCustomMutation({
    execute: clientService.softDeleteClient,
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: 'Cliente eliminado correctamente',
      })
      getClients({ estado: 'A', ...filters })
    },
    onError: (e) => showHandleError(e as never),
  })

  useEffect(() => {
    getClients({ ...filters })
  }, [getClients, filters])

  useEffect(() => {
    if (data?.data) {
      const newData = data?.data?.map((item: any) => {
        // Normalize top-level object
        const normalizedItem: any = {}
        Object.keys(item).forEach((key) => {
          normalizedItem[key.toLowerCase()] = item[key]
        })

        // Normalize nested entidad/ENTIDAD
        const rawEntidad = item?.entidad || item?.ENTIDAD
        const normalizedEntidad: any = {}
        if (rawEntidad) {
          Object.keys(rawEntidad).forEach((key) => {
            const lowerKey = key.toLowerCase()
            // Special case for the typo
            if (lowerKey === 'tipo_empelo') {
              normalizedEntidad['tipo_empleo'] = rawEntidad[key]
            } else {
              normalizedEntidad[lowerKey] = rawEntidad[key]
            }
          })
        }
        
        normalizedItem.entidad = normalizedEntidad

        const tipoDoc = NameTipoDocIdent[normalizedEntidad?.tipo_doc_ident || 0]
        return {
          ...normalizedItem,
          nombre_cliente:
            (normalizedEntidad?.nombres || '') + 
            ' ' + 
            (normalizedEntidad?.apellidos || ''),
          tipo_doc: tipoDoc ? tipoDoc.toUpperCase() : '',
        }
      })
      setDataSource(newData as any)
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
      title: 'Código',
      dataIndex: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      key: '',
      title: 'Tipo de Documento',
      dataIndex: 'tipo_doc',
      filters: [
        { text: 'CEDULA', value: 'CEDULA' },
        { text: 'RNC', value: 'RNC' },
        { text: 'PASAPORTE', value: 'PASAPORTE' },
      ],
      onFilter: (value: any, record: any) => record?.tipo_doc?.includes(value),
    },
    {
      title: 'NO. Documento Identidad',
      dataIndex: ['entidad', 'documento_ident'],
      ...getColumnSearchProps(
        ['entidad', 'documento_ident'],
        'Documento Identidad',
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre_cliente',
      ...getColumnSearchProps('nombre_cliente', 'Nombre'),
    },
    {
      title: 'Fecha de Registro',
      dataIndex: 'fecha_insercion',
      render: (date: any) => date?.toString().split('T')[0],
      sorter: (a: any, b: any) =>
        new Date(a.fecha_insercion).getTime() -
        new Date(b.fecha_insercion).getTime(),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: '100px',
      render: (estado: string) => (
        <Tag color={estado === EstadoGeneral.ACTIVO ? 'green' : 'red'}>
          {estado === EstadoGeneral.ACTIVO ? 'A' : 'I'}
        </Tag>
      ),
      filters: [
        { text: 'Activo (A)', value: EstadoGeneral.ACTIVO },
        { text: 'Inactivo (I)', value: EstadoGeneral.INACTIVO },
      ],
      filteredValue: filters.estado ? [filters.estado] : null,
      filterMultiple: false,
    },
    {
      title: 'Acciones',
      render: (record: ClientDto) => {
        return (
          <Space size="middle">
            <CustomTooltip title="Ver Detalles">
              <CustomIcons.FileSearchOutlined
                style={{ cursor: 'pointer', color: '#1890ff' }}
                onClick={() => {
                  navigate(PATH_REGISTER_CLIENT, {
                    state: { clientData: record, onlyView: true },
                  })
                }}
              />
            </CustomTooltip>
            <CustomTooltip title="Editar">
              <CustomIcons.FormOutlined
                style={{ cursor: 'pointer', color: '#faad14' }}
                onClick={() => {
                  navigate(PATH_REGISTER_CLIENT, {
                    state: { clientData: record, edit: true },
                  })
                }}
              />
            </CustomTooltip>
            <CustomTooltip title="Eliminar">
              <Popconfirm
                title="¿Estás seguro de eliminar este cliente?"
                onConfirm={() => deleteClient(record.id!)}
                okText="Sí"
                cancelText="No"
              >
                <CustomIcons.DeleteOutlined
                  style={{ cursor: 'pointer', color: 'red' }}
                />
              </Popconfirm>
            </CustomTooltip>
          </Space>
        )
      },
    },
  ]
  const title = () => (
    <>
      <Row justify={'space-between'} align="middle">
        <CustomTitle level={4}>Clientes Registrados</CustomTitle>
        <Space>
           <RangePicker onChange={handleDateChange} />
          <CustomButton
            icon={<CustomIcons.UserAddOutlined />}
            onClick={() => navigate(PATH_REGISTER_CLIENT)}
            size="small"
            type="primary"
          >
            Agregar Cliente
          </CustomButton>
        </Space>
      </Row>
    </>
  )
  return (
    <>
      <CustomTitle level={2}>Consulta de Clientes</CustomTitle>
      <CustomTable
        rowKey={(record: ClientDto) => record.id ?? ''}
        title={title}
        columns={columns}
        dataSource={dataSource}
        loading={isPending}
        onChange={handleTableChange}
      />
    </>
  )
}

export default ConsulClient
