import React, { useReducer } from 'react'
import { Layout, Menu } from 'antd'
import { MenuInfo, menuInfos } from '../../@menus'
import { CustomIcon } from '../../comps/CustomIcon'
import { RouteProps } from '../../pages/@types'
import { useTokenSelector } from '../../@version/token'

interface AppSiderProps {
  collapsed: boolean
  setCollapsed: (collapse: boolean) => void
}

interface State {
  autoCollapse: boolean
  mustQuickSet: boolean
}

export function AppSider(props: AppSiderProps & RouteProps<void>) {

  const { collapsed, setCollapsed, location, history } = props
  const userRoles = useTokenSelector(state => state.token?.user.roles || [])

  const reducer = (state: State, collapse: boolean) => {
    return { autoCollapse: collapse, mustQuickSet: false }
  }
  const initialState = { autoCollapse: true, mustQuickSet: true }
  const [{ autoCollapse, mustQuickSet }, setAutoCollapse] = useReducer(reducer, initialState)

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
        selectedKeys={[location.pathname]}
        style={{ height: '100%' }}
        onClick={selectItem}
      >
        {menuInfos.filter(hasMenuRole(userRoles)).map(menuInfo => (
          <Menu.Item key={menuInfo.matchPath} onMouseDown={midButtonDown(menuInfo)}>
            {renderLabel(menuInfo)}
          </Menu.Item>
        ))}
      </Menu>
    </Layout.Sider>
  )

  function onCollapse(collapse: boolean, type: string) {
    if (type === 'responsive') {
      setAutoCollapse(collapse)
      if (mustQuickSet) {
        setCollapsed(collapse)
      } else {
        setTimeout(() => {
          setCollapsed(collapse)
        }, 200)
      }
    }
  }

  function selectItem({ key: path }: { key: string }) {
    if (path === location.pathname) {
      return
    }
    if (autoCollapse) {
      setCollapsed(true)
    }
    if (path.startsWith('/')) {
      history.push(path)
    } else {
      window.open(path)
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

}

function hasMenuRole(userRoles: string[]) {
  return ({ menuRole }: MenuInfo) => {
    if (menuRole === undefined)
      return true
    for (const role of menuRole) {
      if (userRoles.includes(role)) {
        return true
      }
    }
    return false
  }
}

function renderLabel({ iconType, iconNode, menuTitle }: MenuInfo) {
  if (iconNode) {
    return <span><CustomIcon className="sider-icon" iconNode={iconNode} />{menuTitle}</span>
  }
  if (iconType) {
    return <span><CustomIcon className="sider-icon" iconType={iconType} />{menuTitle}</span>
  }
  return <span>{menuTitle}</span>
}
