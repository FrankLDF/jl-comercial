import React from 'react'
import { Radio } from 'antd'
import type { RadioGroupProps } from 'antd'

export const CustomRadioGroup: React.FC<RadioGroupProps> = (props) => {
  return <Radio.Group {...props} />
}
