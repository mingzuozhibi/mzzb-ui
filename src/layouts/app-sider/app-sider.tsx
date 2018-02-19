import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { CollapseType } from 'antd/lib/layout/Sider'
import { ClickParam } from 'antd/lib/menu'
import Icon from '../../lib/icon'

import { AppState, default as App } from '../../App'
import { default as routes, RouteInfo } from '../../common/routes'

export class AppSider extends React.Component<RouteComponentProps<{}>, {}> {

  static contextTypes = App.childContextTypes

  userRoles: string[]

  onCollapse = (hideSider: boolean, type: CollapseType) => {
    if (type === 'responsive') {
      this.context.update((draft: AppState) => {
        draft.hideSider = hideSider
      })
    }
  }

  onClickItem = ({key}: ClickParam) => {
    if (key.charAt(0) === '/') {
      if (key !== location.pathname) {
        this.context.update((draft: AppState) => {
          draft.reload = undefined
          draft.bodyWidth <= 600 && (draft.hideSider = true)
        })
        this.props.history.push(key)
      }
    } else {
      window.open(key)
    }
  }

  renderTitle = (route: RouteInfo) => {
    return (
      <span><Icon className="sider-icon" type={route.icon}/>{route.text}</span>
    )
  }

  renderMenu = (route: RouteInfo): React.ReactNode => {
    if (route.role && !this.userRoles.some(role => role === route.role)) {
      return null
    }
    switch (route.type) {
      case 'Routes':
        return (
          <Menu.SubMenu key={route.path} title={this.renderTitle(route)}>
            {route.routes.map(this.renderMenu)}
          </Menu.SubMenu>
        )
      case 'Route':
        return (
          <Menu.Item key={route.path}>
            {this.renderTitle(route)}
          </Menu.Item>
        )
      default:
        return (
          <Menu.Item key={route.path}>
            {this.renderTitle(route)}
          </Menu.Item>
        )
    }
  }

  render() {
    this.userRoles = this.context.state.session.userRoles

    return (
      <Layout.Sider
        className="app-sider"
        collapsed={this.context.state.hideSider}
        onCollapse={this.onCollapse}
        collapsedWidth={0}
        breakpoint="md"
        trigger={null}
      >
        <div className="sider-logo">
          <h2>名作之壁</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[this.props.location.pathname]}
          style={{height: '100%'}}
          onClick={this.onClickItem}
        >
          {routes.map(this.renderMenu)}

        </Menu>
      </Layout.Sider>
    )
  }
}
