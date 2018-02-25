import * as React from 'react'
import { Icon as AntdIcon } from 'antd'
import { IconProps } from 'antd/lib/icon'
import './icon.css'

const FontIcon = ({type, className, ...props}: IconProps) => {
  // noinspection HtmlUnknownAttribute
  const useTag = `<use xlink:href="#${type}" />`
  return (
    <span className={className} {...props}>
      <svg
        className="icon-font"
        aria-hidden="true"
        dangerouslySetInnerHTML={{__html: useTag}}
      />
    </span>
  )
}

const Icon = ({type, className, ...props}: IconProps) => {
  if (type.substr(0, 5) === 'icon-') {
    return (
      <span className="icon-wrapper">
        <FontIcon {...props} type={type} className={className}/>
      </span>
    )
  } else {
    return (
      <span className="icon-wrapper">
        <AntdIcon {...props} type={type} className={className}/>
      </span>
    )
  }
}

export { Icon }
