import React, { useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Layout, Popconfirm } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, SyncOutlined } from '@ant-design/icons'
import { CustomIcon } from '../comps/CustomIcon'
import { tokenRequest, logoutRequest, useTokenSelector } from '../@version/token'
import { useLayoutSelector, setViewSider, setViewLogin } from '../reducers/layout'

export default function AppHeader() {

  const dispatch = useDispatch()
  const isLogin = useTokenSelector(state => state.roles.isLogin)
  const viewSider = useLayoutSelector(state => state.viewSider)

  useEffect(() => {
    dispatch(tokenRequest({ isUserRequest: false }))
  }, [dispatch])

  const loggedIcon = useMemo(() => (
    <Popconfirm title="你确定要登出吗？" okText="OK" cancelText="Cancel"
      placement="bottomRight" onConfirm={() => dispatch(logoutRequest())}>
      <HeaderIcon iconType="icon-user" />
    </Popconfirm>
  ), [dispatch])

  const logoutIcon = useMemo(() => (
    <HeaderIcon iconType="icon-login" onClick={() => dispatch(setViewLogin(true))} />
  ), [dispatch])

  return (
    <Layout.Header className="app-header">
      <HeaderIcon iconNode={viewSider ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={() => dispatch(setViewSider(!viewSider))} />
      <span style={{ marginLeft: 24 }}>在线人数: TODO</span>
      <span style={{ float: 'right', paddingRight: 24 }}>
        <HeaderIcon iconNode={<SyncOutlined />} onClick={() => dispatch(tokenRequest({ isUserRequest: true }))} />
        {isLogin ? loggedIcon : logoutIcon}
      </span>
    </Layout.Header>
  )

}

function HeaderIcon({ className, ...props }: any) {
  return <CustomIcon className="header-icon" {...props} />
}
