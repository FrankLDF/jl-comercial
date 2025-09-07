import React from 'react'
import { Form, type FormItemProps } from 'antd'
import {
  generateValidationRules,
  type RuleType,
} from '../../utils/validationResolver'

interface CustomFormItemProps extends Omit<FormItemProps, 'rules'> {
  required?: boolean
  min?: number
  max?: number
  maxLength?: number
  type?: RuleType
  rules?: FormItemProps['rules']
}

export const CustomFormItem: React.FC<CustomFormItemProps> = ({
  label,
  required,
  min,
  max,
  maxLength,
  rules,
  children,
  type,
  ...rest
}) => {
  const generatedRules = generateValidationRules({
    required,
    type,
    min,
    max,
    maxLength,
    label: label?.toString(),
  })

  return (
    <Form.Item
      label={label}
      {...rest}
      rules={rules && rules.length > 0 ? rules : generatedRules}
    >
      {children}
    </Form.Item>
  )
}
