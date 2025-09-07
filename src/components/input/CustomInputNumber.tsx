import React from 'react'
import { InputNumber, type InputNumberProps } from 'antd'

export const CustomInputNumber: React.FC<InputNumberProps> = (props) => {
  return <InputNumber {...props} />
}

// export const CustomInputNumber = Object.assign(BaseCustomInputNumber, {})
