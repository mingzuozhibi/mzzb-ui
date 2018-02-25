import * as React from 'react'
import { Alert } from 'antd'
import { Helmet } from 'react-helmet'

export class Home extends React.Component {
  render() {
    return (
      <div id="home-root">
        <Helmet>
          <title>名作之壁吧 - 用销量说话，用数据打脸，口胡不上税</title>
        </Helmet>
        {location.search === '?not-found' && (
          <Alert message={`未找到你想访问的页面`} type="error"/>
        )}
        <h3>Welcome!</h3>
      </div>
    )
  }
}
