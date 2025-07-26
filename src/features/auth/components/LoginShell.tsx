import { type ReactNode } from 'react'
import { Grid } from 'antd'
import { myPrimaryColor } from '../../../utils/constants'

const { useBreakpoint } = Grid

interface LoginLayoutProps {
  logo: ReactNode
  form: ReactNode
}

export const LoginShell = ({ logo, form }: LoginLayoutProps) => {
  const screens = useBreakpoint()
  const isMobile = !screens.md // md = 768px

  if (isMobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: `${myPrimaryColor}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '3rem 1rem 1.5rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {logo}
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: '3rem 1.5rem',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 400,
            }}
          >
            {form}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div
        style={{
          flex: 1,
          backgroundColor: `${myPrimaryColor}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {logo}
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 360,
          }}
        >
          {form}
        </div>
      </div>
    </div>
  )
}
