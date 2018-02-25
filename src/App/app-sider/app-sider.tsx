import * as React from 'react'
import { Layout, Menu } from 'antd'
import { Icon } from '../../lib/icon'

import { RouteInfo, routeInfos } from '../../common/route-infos'
import { RouteComponentProps } from 'react-router-dom'
import { ViewportProps } from '../../hoc/Viewport'

export type OwnProps = ViewportProps & RouteComponentProps<{}>

interface AppSiderProps extends OwnProps {
  viewSider: boolean
  userRoles: string[]
  setViewSider: (viewSider: boolean) => void
}

export function AppSider(props: AppSiderProps) {

  function onCollapse(hideSider: boolean, type: 'clickTrigger' | 'responsive') {
    if (type === 'responsive') {
      props.setViewSider(!hideSider)
    }
  }

  function selectItem({key}: { key: string }) {
    if (key === props.location.pathname) {
      return
    }
    if (props.viewport!.width <= 768) {
      props.setViewSider(false)
    }
    if (key.charAt(0) === '/') {
      props.history.push(key)
    } else {
      window.open(key)
    }
  }

  function renderTitle(icon: string, text: string) {
    return <span><Icon className="sider-icon" type={icon}/>{text}</span>
  }

  function renderMenu(route: RouteInfo, userRoles: string[]): React.ReactNode {
    if (route.role && !userRoles.some(role => role === route.role)) {
      return null
    }
    switch (route.type) {
      case 'Routes':
        return (
          <Menu.SubMenu key={route.path} title={renderTitle(route.icon, route.text)}>
            {route.routes.map(subRoute => renderMenu(subRoute, userRoles))}
          </Menu.SubMenu>
        )
      case 'Simple':
      case 'Link':
        return (
          <Menu.Item key={route.path}>
            {renderTitle(route.icon, route.text)}
          </Menu.Item>
        )
      default:
        return undefined
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
