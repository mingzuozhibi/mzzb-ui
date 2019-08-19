import React from 'react'
import { Button } from 'antd'

interface CommandProp {
  onClick: () => void
  children: React.ReactNode
}

export const Command = ({onClick, children}: CommandProp) => {
  return <Button type="link" onClick={onClick}>{children}</Button>
}
