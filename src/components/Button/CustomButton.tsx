import React from 'react'
import { Button, type ButtonProps } from 'antd'

const customButtonStyle: React.CSSProperties = {
  borderRadius: 6,
  fontWeight: 500,
  padding: '15px',
  // height: 30,
  margin: '10px',
}

export const CustomButton: React.FC<ButtonProps> = ({
  children,
  style,
  type = 'primary',
  ...rest
}) => {
  return (
    <Button type={type} style={{ ...customButtonStyle, ...style }} {...rest}>
      {children}
    </Button>
  )
}
