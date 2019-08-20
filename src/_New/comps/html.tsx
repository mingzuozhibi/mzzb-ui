import React from 'react'

interface OutlinkProps {
  href: string
  title: string
}

export function Outlink({href, title}: OutlinkProps) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{title}</a>
}
