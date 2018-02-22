import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { Icon } from '../../lib/icon'

import { RouteInfo, routeInfos } from '../../common/route-infos'
import { CollapseType } from 'antd/lib/layout/Sider'
import { ClickParam } from 'antd/lib/menu'

interface AppSiderProps extends RouteComponentProps<{}> {
  bodyWidth: number
  viewSider: boolean
  userRoles: string[]
  clearReload: () => void
  setViewSider: (viewSider: boolean) => void
}

export function AppSider(props: AppSiderProps) {

  function onCollapse(hideSider: boolean, type: CollapseType) {
    if (type === 'responsive') {
      props.setViewSider(!hideSider)
    }
  }

  function selectItem({key}: ClickParam) {
    if (key === props.location.pathname) {
      return
    }
    if (props.bodyWidth <= 768) {
      props.setViewSider(false)
    }
    if (key.charAt(0) === '/') {
      props.clearReload()
      props.history.push(key)
    } else {
      window.open(key)
    }
  }

  function renderTitle(route: RouteInfo) {
    return (
      <span><Icon className="sider-icon" type={route.icon}/>{route.text}</span>
    )
  }

  function renderMenu(route: RouteInfo, userRoles: string[]): React.ReactNode {
    if (route.role && !userRoles.some(role => role === route.role)) {
      return null
    }
    if (route.type === 'Routes') {
      return (
        <Menu.SubMenu key={route.path} title={renderTitle(route)}>
          {route.routes.map(subRoute => renderMenu(subRoute, userRoles))}
        </Menu.SubMenu>
      )
    } else {
      return (
        <Menu.Item key={route.path}>
          {renderTitle(route)}
        </Menu.Item>
      )
    }
  }

  return (
    <Layout.Sider
      className="app-sider"
      collapsed={!props.viewSider}
      onCollapse={onCollapse}
      collapsedWidth={0}
      breakpoint="md"
      trigger={null}
    >
      <div className="sider-logo">
        <h2>名作之壁</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[props.location.pathname]}
        style={{height: '100%'}}
        onClick={selectItem}
      >
        {routeInfos.map(route => renderMenu(route, props.userRoles))}
      </Menu>
    </Layout.Sider>
  )
}
