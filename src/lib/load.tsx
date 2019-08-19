import React from 'react'
import { Alert } from 'antd'

interface LoadProps {
  pastDelay: boolean
  timedOut: boolean
  error: any
}

const Load = ({error, timedOut, pastDelay}: LoadProps) => {
  if (error) {
    return <Alert message={`加载异步模块失败: ${error}`} type="error"/>
  } else if (timedOut) {
    return <Alert message="加载异步模块非常缓慢，请检查您的网络" type="warning"/>
  } else if (pastDelay) {
    return <Alert message="正在加载异步模块" type="info"/>
  } else {
    return null
  }
}

export { Load }
