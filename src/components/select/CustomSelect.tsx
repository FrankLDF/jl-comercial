import React from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'

export const CustomSelect: React.FC<SelectProps> = (props) => {
  return (
    <Select
      placeholder="Seleccione"
      optionFilterProp="label"
      showSearch
      allowClear
      {...props}
    />
  )
}
