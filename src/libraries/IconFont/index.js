import React from 'react'

const menuIconStyle = {fontSize: '14px', marginRight: '10px'}

export default function IconFont({type, style = menuIconStyle, ...props}) {
  return (
    <i {...props} style={style} className={'iconfont ' + type}/>
  )
}
