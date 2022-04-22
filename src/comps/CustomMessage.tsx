import { Alert } from 'antd'

interface Props {
  unikey?: string
  message: string
}

export function CustomMessage({ unikey, message }: Props) {
  if (!unikey) unikey = window.location.pathname
  const showMessage = localStorage[`message/${unikey}`] !== message
  const hideMessage = () => (localStorage[`message/${unikey}`] = message)
  return showMessage ? <Alert message={message} closable onClose={hideMessage} /> : null
}
