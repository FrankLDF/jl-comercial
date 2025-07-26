import { notification } from 'antd'

type NotifyType = 'success' | 'info' | 'warning' | 'error'

interface NotifyProps {
  type: NotifyType
  message: string
  title?: string
}

export const showNotification = ({ type, message, title }: NotifyProps) => {
  notification[type]({
    message: title || type.toUpperCase(),
    description: message,
    placement: 'topRight',
  })
}
