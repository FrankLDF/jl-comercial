import { Table, type TableProps } from 'antd'

type CustomTableProps<RecordType> = TableProps<RecordType>

const CustomTable = <T extends object>(props: CustomTableProps<T>) => {
  return <Table<T> bordered={true} {...props} />
}

export default CustomTable
