import { useEffect, useState } from 'react'
import CustomTable from '../../../components/table/CustomTable'
import { CustomTitle } from '../../../components/tittle/CustomTittle'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import { showHandleError } from '../../../utils/handleError'
import clientService from '../services/clientService'
import type { ClientDto } from '../dto-clientDto'
import { NameTipoDocIdent } from '../../../utils/constants'
import { Row, Space } from 'antd'
import { CustomButton } from '../../../components/Button/CustomButton'
import { useNavigate } from 'react-router-dom'
import { PATH_REGISTER_CLIENT } from '../../../routes/pathts'
import CustomIcons from '../../../components/icons/CustomIcon'
import CustomTooltip from '../../../components/tooltip/CustomTooltip'
import { getColumnSearchProps } from '../../../utils/serachColumns'

const ConsulClient = () => {
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState()
  const {
    mutate: getClients,
    isPending,
    data,
  } = useCustomMutation({
    execute: clientService.getClient,
    onError: (e) => showHandleError(e as never),
  })

  useEffect(() => {
    getClients({ ESTADO: 'A' })
  }, [getClients])

  useEffect(() => {
    if (data) {
      const newData = data.map((item: ClientDto) => {
        const tipoDoc = NameTipoDocIdent[item?.ENTIDAD?.TIPO_DOC_IDENT]
        return {
          ...item,
          NOMBRE_CLIENTE:
            item?.ENTIDAD?.NOMBRES + ' ' + (item?.ENTIDAD?.APELLIDOS || ''),
          TIPO_DOC: tipoDoc.toUpperCase(),
        }
      })
      setDataSource(newData)
    }
  }, [data])

  const columns = [
    {
      title: 'Código',
      dataIndex: 'ID',
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      key: '',
      title: 'Tipo de Documento',
      dataIndex: 'TIPO_DOC',
      filters: [
        { text: 'CEDULA', value: 'CEDULA' },
        { text: 'RNC', value: 'RNC' },
        { text: 'PASAPORTE', value: 'PASAPORTE' },
      ],
      onFilter: (value, record) => record?.TIPO_DOC?.includes(value),
    },
    {
      title: 'NO. Documento Identidad',
      dataIndex: ['ENTIDAD', 'DOCUMENTO_IDENT'],
      ...getColumnSearchProps(
        ['ENTIDAD', 'DOCUMENTO_IDENT'],
        'Documento Identidad'
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'NOMBRE_CLIENTE',
      ...getColumnSearchProps('NOMBRE_CLIENTE', 'Nombre'),
    },
    {
      title: 'Acciones',
      render: (record: ClientDto) => {
        return (
          <Space size="middle">
            <CustomTooltip title="Ver Detalles">
              <CustomIcons.FileSearchOutlined
                onClick={() => {
                  navigate(PATH_REGISTER_CLIENT, {
                    state: { clientData: record, onlyView: true },
                  })
                }}
              />
            </CustomTooltip>
            <CustomTooltip title="Editar">
              <CustomIcons.FormOutlined
                onClick={() => {
                  navigate(PATH_REGISTER_CLIENT, {
                    state: { clientData: record, edit: true },
                  })
                }}
              />
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
        <CustomButton
          icon={<CustomIcons.UserAddOutlined />}
          onClick={() => navigate(PATH_REGISTER_CLIENT)}
          size="small"
          type="primary"
        >
          Agregar Cliente
        </CustomButton>
      </Row>
    </>
  )
  return (
    <>
      <CustomTitle level={2}>Consulta de Clientes</CustomTitle>
      <CustomTable
        rowKey={(record: ClientDto) => record.ID ?? ''}
        title={title}
        columns={columns}
        dataSource={dataSource}
        loading={isPending}
      />
    </>
  )
}

export default ConsulClient
