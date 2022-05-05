import { useItems } from '##/@menus'
import { Layout, Menu } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useMemo, useReducer } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

interface AppSiderProps {
  userRoles: string[]
  collapsed: boolean
  setCollapsed: (collapse: boolean) => void
}

interface State {
  autoCollapse: boolean
  mustQuickSet: boolean
}

export function AppSider(props: AppSiderProps) {
  const { userRoles, collapsed, setCollapsed } = props

  const history = useHistory()
  const location = useLocation()

  const items = useMemo(() => useItems(userRoles), [userRoles])

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
        items={items}
      />
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
  function selectItem({ key, domEvent }: MenuInfo) {
    if (domEvent.ctrlKey || key.startsWith('http')) {
      window.open(key)
    } else if (key !== location.pathname) {
      history.push(key)
    }
    if (autoCollapse) {
      setCollapsed(true)
    }
  }
}
