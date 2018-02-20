import * as React from 'react'
import { Alert } from 'antd'

export class Home extends React.Component {
  render() {
    return (
      <div id="home-root">
        {location.search === '?not-found' && (
          <Alert message={`未找到你想访问的页面`} type="error"/>
        )}
        <h3>Welcome!</h3>
      </div>
    )
  }
}
