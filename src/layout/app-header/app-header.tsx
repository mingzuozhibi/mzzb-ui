import React, { useMemo, useCallback, useEffect } from 'react'
import { Layout, Popconfirm } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, SyncOutlined } from '@ant-design/icons'
import { CustomIcon } from '../../comps/CustomIcon'
import { useDispatch } from 'react-redux'

interface AppHeaderProps {
  isLogged: boolean
  viewSider: boolean
  showLogin: () => void
  setViewSider: (viewSider: boolean) => void
}

export function AppHeader(props: AppHeaderProps) {

  const { isLogged, viewSider, showLogin, setViewSider } = props

  const dispatch = useDispatch()

  const tokenRequest = useCallback(() => {
    dispatch({ type: 'token_request', isUserRequest: true })
  }, [dispatch])

  const logoutRequest = useCallback(() => {
    dispatch({ type: 'logout_request' })
  }, [dispatch])

  useEffect(() => {
    dispatch({ type: 'token_request', isUserRequest: false })
  }, [dispatch])

  const loggedIcon = useMemo(() => (
    <Popconfirm title="你确定要登出吗？" okText="OK" cancelText="Cancel"
      placement="bottomRight" onConfirm={logoutRequest}>
      <HeaderIcon iconType="icon-user" />
    </Popconfirm>
  ), [logoutRequest])

  const logoutIcon = useMemo(() => (
    <HeaderIcon iconType="icon-login" onClick={showLogin} />
  ), [showLogin])

  return (
    <Layout.Header className="app-header">
      <HeaderIcon iconNode={viewSider ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={() => setViewSider(!viewSider)} />
      <span style={{ marginLeft: 24 }}>在线人数: TODO</span>
      <span style={{ float: 'right', paddingRight: 24 }}>
        <HeaderIcon iconNode={<SyncOutlined />} onClick={tokenRequest} />
        {isLogged ? loggedIcon : logoutIcon}
      </span>
    </Layout.Header>
  )

}

function HeaderIcon({ className, ...props }: any) {
  return <CustomIcon className="header-icon" {...props} />
}
