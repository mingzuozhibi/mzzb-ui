import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import { MenuInfo, menuInfos } from '../../@menus'
import { CustomIcon } from '../../comps/CustomIcon'

interface AppSiderProps {
  viewSider: boolean
  userRoles: string[]
  setViewSider: (viewSider: boolean) => void
}

export function AppSider(props: AppSiderProps & RouteComponentProps<void>) {

  const [responsive, setResponsive] = useState(false)

  function onCollapse(hideSider: boolean, type: string) {
    if (type === 'responsive') {
      setResponsive(!hideSider)
      setTimeout(() => {
        props.setViewSider(!hideSider)
      }, 200)
    }
  }

  function selectItem({key}: { key: string }) {
    if (key === props.location.pathname) {
      return
    }
    if (!responsive) {
      props.setViewSider(false)
    }
    if (key.charAt(0) === '/') {
      props.history.push(key)
    } else {
      window.open(key)
    }
  }

  function renderLabel({iconType, iconNode, menuTitle}: MenuInfo) {
    if (iconNode) {
      return <span><CustomIcon className="sider-icon" iconNode={iconNode}/>{menuTitle}</span>
    }
    if (iconType) {
      return <span><CustomIcon className="sider-icon" iconType={iconType}/>{menuTitle}</span>
    }
    return <span>{menuTitle}</span>
  }

  function renderMenu(menuInfo: MenuInfo, userRoles: string[]): React.ReactNode {
    if (menuInfo.menuRole && !userRoles.some(role => role === menuInfo.menuRole)) {
      return null
    }
    return (
      <Menu.Item key={menuInfo.matchPath}>
        <span onMouseDown={open(menuInfo)}>{renderLabel(menuInfo)}</span>
      </Menu.Item>
    )
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

function open(menuInfo: MenuInfo) {
  return (e: any) => e.button === 1 && window.open(menuInfo.matchPath)
}
