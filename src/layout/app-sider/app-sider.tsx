import React, { useRef, useState } from 'react'
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

  const collapsed = !props.viewSider
  const setCollapsed = (collapse: boolean) => props.setViewSider(!collapse)

  const [autoCollapse, setAutoCollapse] = useState(true)
  const firstRun = useRef(true)

  function onCollapse(collapse: boolean, type: string) {
    if (type === 'responsive') {
      setAutoCollapse(collapse)
      if (firstRun.current) {
        firstRun.current = false
        setCollapsed(collapse)
      } else {
        setTimeout(() => {
          setCollapsed(collapse)
        }, 200)
      }
    }
  }

  function selectItem({key}: { key: string }) {
    if (key === props.location.pathname) {
      return
    }
    if (autoCollapse) {
      setCollapsed(true)
    }
    if (key.charAt(0) === '/') {
      props.history.push(key)
    } else {
      window.open(key)
    }
  }

  function midButtonDown(menuInfo: MenuInfo) {
    return (e: any) => {
      if (e.button === 1) {
        if (autoCollapse) {
          setCollapsed(true)
        }
        window.open(menuInfo.matchPath)
      }
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
      <Menu.Item key={menuInfo.matchPath} onMouseDown={midButtonDown(menuInfo)}>
        {renderLabel(menuInfo)}
      </Menu.Item>
    )
  }

  return (
    <Layout.Sider
      className="app-sider"
      collapsed={collapsed}
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
