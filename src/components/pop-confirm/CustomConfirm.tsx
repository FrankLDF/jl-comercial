import { Popconfirm } from 'antd'
import type { PopconfirmProps } from 'antd'
import type { ReactNode } from 'react'

interface CustomConfirmProps extends PopconfirmProps {
  children: ReactNode
}

export const CustomConfirm = ({
  title,
  onConfirm,
  onCancel,
  okText = 'Aceptar',
  cancelText = 'Cancelar',
  placement = 'topRight',
  children,
  ...rest
}: CustomConfirmProps) => {
  return (
    <Popconfirm
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      placement={placement}
      {...rest}
    >
      {children}
    </Popconfirm>
  )
}
