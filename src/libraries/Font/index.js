import React from 'react'

export function Font({name, type = 'menu', className, ...props}) {
  switch (type) {
    case 'menu':
      return <i {...props} className={`iconfont ${name} ${className} menu-icon`}/>
    case 'header':
      return <i {...props} className={`iconfont ${name} ${className} header-icon`}/>
    default:
      return <i {...props} className={`iconfont ${name} ${className}`}/>
  }
}
