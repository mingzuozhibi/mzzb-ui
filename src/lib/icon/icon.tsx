import * as React from 'react'
import { Icon as AntdIcon } from 'antd'
import { IconProps } from 'antd/lib/icon'

export class Icon extends React.Component<IconProps, {}> {
  render() {
    if (this.props.type.substr(0, 5) === 'icon-') {
      return <i {...this.props} className={`iconfont ${this.props.type} ${this.props.className}`}/>
    } else {
      return <AntdIcon {...this.props}/>
    }
  }
}
