import { useNavigate } from 'react-router-dom'
import { CustomButton } from '../../../components/Button/CustomButton'
import { CustomForm } from '../../../components/form/CustomForm'
import { CustomFormItem } from '../../../components/form/CustomFormItem'
import { CustomInput } from '../../../components/input/CustomInput'
import { LoginShell } from '../components/LoginShell'
import { useCustomMutation } from '../../../hooks/UseCustomMutation'
import { PATH_MAIN } from '../../../routes/pathts'
import { useAuth } from '../../../hooks/UseAuthContext'
import { showHandleError } from '../../../utils/handleError'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { mutate: loginUser, isPending } = useCustomMutation({
    execute: login,
    onSuccess: () => {
      navigate(PATH_MAIN, { replace: true })
    },
    onError: (err) => {
      console.log({ err })
      showHandleError(err as never)
    },
  })
  return (
    <LoginShell
      logo={
        <img src="/logo.png" alt="Logo empresa" style={{ maxWidth: 300 }} />
      }
      form={
        <CustomForm layout="vertical" onFinish={loginUser}>
          <CustomFormItem label="Usuario" name="nombre_usuario" required>
            <CustomInput size="large" />
          </CustomFormItem>

          <CustomFormItem label="Contraseña" name="password" required>
            <CustomInput.Password size="large" />
          </CustomFormItem>

          <CustomButton
            loading={isPending}
            type="primary"
            htmlType="submit"
            block
          >
            Iniciar sesión
          </CustomButton>
        </CustomForm>
      }
    />
  )
}
