import { LoginShell } from '../components/LoginShell'
import { Form, Input, Button } from 'antd'

export const Login = () => {
  const handleFinish = () => {
    console.log('Login:')
  }
  // const { mutate: loginUser, isPending } = useCustomMutation({
  //   execute: auth.login,
  //   onSuccess: () => {
  //     navigate(PATH_MAIN, { replace: true })
  //   },
  //   onError: (err) => {
  //     console.log(err)
  //     showNotification({
  //       type: 'error',
  //       message: `${err.response.data.message}`,
  //     })
  //   },
  // })
  return (
    <LoginShell
      logo={
        <img src="/logo.png" alt="Logo empresa" style={{ maxWidth: 300 }} />
      }
      form={
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Ingrese su usuario' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Ingrese su contraseña' }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Iniciar sesión
          </Button>
        </Form>
      }
    />
  )
}
