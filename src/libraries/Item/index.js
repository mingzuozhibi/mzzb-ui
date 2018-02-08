import React, {Component} from 'react'
import {Route} from 'react-router'
import {Menu, Spin} from 'antd'

export default class Item {

  constructor(path, text, {icon, items, active, component}) {
    this.path = path
    this.text = text
    this.icon = icon
    this.items = items
    this.active = active
    this.component = component
  }

  renderTitle() {
    return (
      <span>{this.icon}<span>{this.text}</span></span>
    )
  }

  renderMenu(isAdmin) {
    if (this.active === 'route') {
      return
    }
    if (this.active === 'admin' && !isAdmin) {
      return
    }
    if (this.items) {
      return (
        <Menu.SubMenu key={this.path} title={this.renderTitle()}>
          {this.items.map(item => this.renderMenu.call(item))}
        </Menu.SubMenu>
      )
    } else {
      return (
        <Menu.Item key={this.path}>
          {this.renderTitle()}
        </Menu.Item>
      )
    }
  }

  renderRoute() {
    if (this.active === 'link') {
      return
    }
    if (this.items) {
      return this.items.map(item => this.renderRoute.call(item))
    } else {
      return (
        <Route key={this.path} path={this.path} component={asyncComponent(this.component)}/>
      )
    }
  }

}

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
