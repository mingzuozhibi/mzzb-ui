import * as React from 'react'
import { Alert } from 'antd'
import LoadingComponentProps = LoadableExport.LoadingComponentProps

export class Loading extends React.Component<LoadingComponentProps, {}> {
  render() {
    if (this.props.error) {
      return <Alert message={`加载异步模块失败: ${this.props.error}`} type="error"/>
    } else if (this.props.timedOut) {
      return <Alert message="加载异步模块非常缓慢，请检查您的网络" type="warning"/>
    } else if (this.props.pastDelay) {
      return <Alert message="正在加载异步模块" type="info"/>
    } else {
      return null
    }
  }
}
