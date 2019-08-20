import React from 'react'

export function outlink(href: string, title: string) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{title}</a>
}
