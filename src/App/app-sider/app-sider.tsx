import * as React from 'react'
import { Layout, Menu } from 'antd'
import { Icon } from '../../lib/icon'

import { MenuInfo, menuInfos } from '../../common/menu-infos'
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
      const handler = () => {
        props.setViewSider(!hideSider)
      }
      setTimeout(handler, 100)
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

  function renderLabel(icon: string, text: string) {
    return <span><Icon className="sider-icon" type={icon}/>{text}</span>
  }

  function renderMenu(menuInfo: MenuInfo, userRoles: string[]): React.ReactNode {
    if (menuInfo.role && !userRoles.some(role => role === menuInfo.role)) {
      return null
    }
    if (menuInfo.subMenus) {
      return (
        <Menu.SubMenu key={menuInfo.path} title={renderLabel(menuInfo.icon, menuInfo.text)}>
          {menuInfo.subMenus.map(subRoute => renderMenu(subRoute, userRoles))}
        </Menu.SubMenu>
      )
    } else {
      return (
        <Menu.Item key={menuInfo.path}>
          {renderLabel(menuInfo.icon, menuInfo.text)}
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
        {menuInfos.map(route => renderMenu(route, props.userRoles))}
      </Menu>
    </Layout.Sider>
  )
}
