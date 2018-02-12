import React from 'react'

export default function Link({style, onClick, children}) {
  return (
    <a style={{cursor: 'pointer', ...style}} onClick={onClick}>
      {children}
    </a>
  )
}
