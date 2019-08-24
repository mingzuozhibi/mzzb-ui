import { Alert } from 'antd'
import React from 'react'

interface Props {
  unikey?: string
  message: string
}

export function ClosableMessage({unikey, message}: Props) {
  if (!unikey) unikey = window.location.pathname
  const showMessage = localStorage[`message/${unikey}`] !== message
  const hideMessage = () => localStorage[`message/${unikey}`] = message
  return showMessage ? <Alert message={message} closable onClose={hideMessage}/> : null
}
