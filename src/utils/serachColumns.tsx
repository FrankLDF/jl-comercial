import { Space } from 'antd'
import { CustomInput } from '../components/input/CustomInput'
import { CustomButton } from '../components/Button/CustomButton'
import CustomIcons from '../components/icons/CustomIcon'
import { myPrimaryColor } from './constants'

export const getColumnSearchProps = (dataIndex, columnTitle = '') => {
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <CustomInput
          placeholder={`Buscar ${columnTitle || dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <CustomButton
            type="primary"
            onClick={() => confirm()}
            icon={<CustomIcons.SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </CustomButton>
          <CustomButton
            type="default"
            onClick={() => {
              if (clearFilters) {
                clearFilters()
                confirm()
              }
            }}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </CustomButton>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <CustomIcons.SearchOutlined
        style={{ color: filtered ? `${myPrimaryColor}` : undefined }}
      />
    ),
    onFilter: (value, record) => {
      const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => {
          return acc && acc[part] !== undefined ? acc[part] : null
        }, obj)
      }

      const recordValue = Array.isArray(dataIndex)
        ? getNestedValue(record, dataIndex.join('.'))
        : record[dataIndex]

      return (
        recordValue?.toString().toLowerCase().includes(value.toLowerCase()) ||
        false
      )
    },
  }
}
