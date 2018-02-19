import * as React from 'react'

interface LinkProps {
  onClick: () => void
  children: React.ReactNode
}

const Link = ({onClick, children}: LinkProps) => {
  return (
    <a style={{cursor: 'pointer'}} onClick={onClick}>
      {children}
    </a>
  )
}

export { Link }
