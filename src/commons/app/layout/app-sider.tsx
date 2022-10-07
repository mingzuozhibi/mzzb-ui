import { useAppDispatch, useAppSelector } from '#CA/hooks'
import { Layout, Menu } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { setViewSider } from '#DF/layout'
import { buildItems } from '../menus'

export function AppSider() {
  const location = useLocation()

  const collapsed = useAppSelector((state) => !state.layout.viewSider)
  const userRoles = useAppSelector((state) => state.session.userRoles)
  const items = useMemo(() => buildItems(userRoles), [userRoles])

  const [autoCollapse, setAutoCollapse] = useState(true)
  const [mustQuickSet, setMustQuickSet] = useState(true)

  const dispatch = useAppDispatch()

  const setCollapsed = useCallback(
    (collapse: boolean) => {
      dispatch(setViewSider(!collapse))
    },
    [dispatch]
  )

  function onCollapse(collapse: boolean, type: string) {
    if (type === 'responsive') {
      setAutoCollapse(collapse)
      if (mustQuickSet) {
        setCollapsed(collapse)
      } else {
        setTimeout(() => {
          setCollapsed(collapse)
          setMustQuickSet(true)
        }, 200)
      }
    }
  }

  function handleClickMenu() {
    if (autoCollapse) {
      setCollapsed(true)
    }
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
        selectedKeys={[location.pathname]}
        style={{ height: '100%' }}
        onClick={handleClickMenu}
        items={items}
      />
    </Layout.Sider>
  )
}
