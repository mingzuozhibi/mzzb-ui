import { useAppDispatch, useAppSelector } from '#CA/hooks'
import { MzIcon } from '#CC/icon/MzIcon'
import { useOnceService } from '#CH/useOnce'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, Popconfirm } from 'antd'
import { useCallback } from 'react'

import { setViewLogin, setViewSider } from '#DF/layout'
import { sessionLogout, sessionQuery } from '#DF/session'

export function AppHeader() {
  const session = useAppSelector((state) => state.session)
  const viewSider = useAppSelector((state) => state.layout.viewSider)

  const dispatch = useAppDispatch()
  const doQuery = useCallback(() => dispatch(sessionQuery()), [dispatch])
  const doLogout = useCallback(() => dispatch(sessionLogout()), [dispatch])
  const showLogin = useCallback(() => dispatch(setViewLogin(true)), [dispatch])
  const showSider = useCallback(() => dispatch(setViewSider(true)), [dispatch])
  const hideSider = useCallback(() => dispatch(setViewSider(false)), [dispatch])

  useOnceService(() => {
    setTimeout(doQuery, 500)
    setInterval(doQuery, 600_000)
  })

  return (
    <Layout.Header className="app-header">
      {viewSider ? (
        <MenuFoldOutlined className="header-icon" onClick={hideSider} />
      ) : (
        <MenuUnfoldOutlined className="header-icon" onClick={showSider} />
      )}
      <span style={{ marginLeft: 24 }}>在线人数: {session.userCount}</span>
      {session.hasBasic ? (
        <Popconfirm
          title="你确定要登出吗？"
          okText="OK"
          cancelText="Cancel"
          placement="bottomRight"
          onConfirm={doLogout}
        >
          <MzIcon type="icon-user" className="header-icon float-right" />
        </Popconfirm>
      ) : (
        <MzIcon type="icon-login" className="header-icon float-right" onClick={showLogin} />
      )}
    </Layout.Header>
  )
}
