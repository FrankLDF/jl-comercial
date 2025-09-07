import React from 'react'
import { Form, type FormProps, type FormInstance } from 'antd'

interface CustomFormProps extends Omit<FormProps, 'form'> {
  form?: FormInstance
  children: React.ReactNode
}

export const CustomForm = ({ form, children, ...rest }: CustomFormProps) => {
  return (
    <Form form={form} {...rest}>
      {children}
    </Form>
  )
}
