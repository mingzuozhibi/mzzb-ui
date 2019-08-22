import React from 'react'
import { Layout, Menu } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import { MenuInfo, menuInfos } from '../../menus'
import { Icon } from '../../comps/icon/Icon'
import { useClientWidth } from '../../hooks/hooks'

interface AppSiderProps {
  viewSider: boolean
  userRoles: string[]
  setViewSider: (viewSider: boolean) => void
}

export function AppSider(props: AppSiderProps & RouteComponentProps<void>) {

  const width = useClientWidth('body')

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
    if (width <= 768) {
      props.setViewSider(false)
    }
    if (key.charAt(0) === '/') {
      props.history.push(key)
    } else {
      window.open(key)
    }
  }

  function renderLabel(text: string, icon?: string) {
    if (icon) {
      return <span><Icon className="sider-icon" type={icon}/>{text}</span>
    } else {
      return <span>{text}</span>
    }
  }

  function renderMenu(menuInfo: MenuInfo, userRoles: string[]): React.ReactNode {
    if (menuInfo.role && !userRoles.some(role => role === menuInfo.role)) {
      return null
    }
    if (menuInfo.subMenus) {
      return (
        <Menu.SubMenu key={menuInfo.path} title={renderLabel(menuInfo.text, menuInfo.icon)}>
          {menuInfo.subMenus.map(subRoute => renderMenu(subRoute, userRoles))}
        </Menu.SubMenu>
      )
    } else {
      return (
        <Menu.Item key={menuInfo.path}>
          <span onMouseDown={e => e.button === 1 && window.open(menuInfo.path)}>
            {renderLabel(menuInfo.text, menuInfo.icon)}
          </span>
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
