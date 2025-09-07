import React from 'react'
import { Input, type InputProps } from 'antd'

const BaseCustomInput: React.FC<InputProps> = (props) => {
  return <Input {...props} />
}

export const CustomInput = Object.assign(BaseCustomInput, {
  Password: Input.Password,
  TextArea: Input.TextArea,
  Search: Input.Search,
  Group: Input.Group,
})
