import * as React from 'react'

interface CommandProp {
  onClick: () => void
  children: React.ReactNode
}

const Command = ({onClick, children}: CommandProp) => {
  return (
    <a style={{cursor: 'pointer'}} onClick={onClick}>
      {children}
    </a>
  )
}

export { Command }
