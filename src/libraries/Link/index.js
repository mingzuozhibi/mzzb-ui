import React from 'react'

export function Link({style, onClick, children}) {
  return (
    <a style={{cursor: 'pointer', ...style}} onClick={onClick}>
      {children}
    </a>
  )
}
