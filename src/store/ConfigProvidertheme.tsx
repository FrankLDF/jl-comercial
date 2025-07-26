import { type ReactNode } from 'react'
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import { myPrimaryColor } from '../utils/constants'

interface providerProps {
  children: ReactNode
}

export const ConfigProviderTheme = ({ children }: providerProps) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: `${myPrimaryColor}`,
          borderRadius: 4,
          fontFamily: ' Inter, sans-serif',
          colorText: '#1f2937',
          colorBgLayout: '#f9fafb',
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  )
}
