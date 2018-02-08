import React, {Component} from 'react'
import {Icon, Spin} from 'antd'
import IconFont from '../libraries/IconFont'
import Home from '../components/Home'

export default [
  {
    path: '/home',
    title: 'Home',
    component: Home,
    icon: <Icon type="home"/>,
  },
  {
    path: '/sakura',
    title: 'Sakura',
    component: asyncComponent(() => import('../components/Sakura')),
    icon: <IconFont type="icon-yinghua"/>,
  },
]

export const link = [
  {
    path: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81',
    title: '名作之壁',
    icon: <IconFont type="icon-social-tieba"/>,
  },
  {
    path: 'https://github.com/mingzuozhibi/mzzb-ui',
    title: 'GitHub',
    icon: <Icon type="github"/>,
  },
]

function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor() {
      super()

      this.state = {
        component: null
      }
    }

    async componentDidMount() {
      const {default: component} = await importComponent()

      this.setState({
        component: component
      })
    }

    render() {
      const C = this.state.component

      return C ? <C {...this.props} /> : <Spin size="large">正在加载组件</Spin>
    }
  }

  return AsyncComponent
}
