import React from 'react'
import { Typography } from 'antd'
import type { TitleProps } from 'antd/es/typography/Title'

const { Title } = Typography

interface CustomTitleProps extends TitleProps {
  size?: number
  align?: React.CSSProperties['textAlign']
}

export const CustomTitle: React.FC<CustomTitleProps> = ({
  size,
  align,
  style,
  children,
  ...rest
}) => {
  return (
    <Title
      style={{ fontSize: size, textAlign: align, marginBottom: 30, ...style }}
      {...rest}
    >
      {children}
    </Title>
  )
}
