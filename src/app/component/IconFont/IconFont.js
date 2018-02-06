import React from 'react'

const style = {fontSize: '14px', marginRight: '10px'}

function IconFont({type}) {
  return (
    <i style={style} className={'iconfont ' + type}/>
  )
}

export default IconFont
