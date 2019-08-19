import React from 'react'
import { Icon as AntdIcon } from 'antd'
import { IconProps } from 'antd/lib/icon'
import './icon.scss'

const FontIcon = ({type, className, ...props}: IconProps) => {
  // noinspection HtmlUnknownAttribute
  const useTag = `<use xlink:href="#${type}" />`
  return (
    <span {...props}>
      <svg
        className="icon-font"
        aria-hidden="true"
        dangerouslySetInnerHTML={{__html: useTag}}
      />
    </span>
  )
}

const Icon = ({type, className, ...props}: IconProps) => {
  if (type!!.substr(0, 5) === 'icon-') {
    return (
      <span className={`icon-wrapper ${className}`}>
        <FontIcon {...props} type={type}/>
      </span>
    )
  } else {
    return (
      <span className={`icon-wrapper ${className}`}>
        <AntdIcon {...props} type={type}/>
      </span>
    )
  }
}

export { Icon }
