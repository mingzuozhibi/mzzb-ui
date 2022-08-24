import { useAppDispatch, useAppSelector } from '#A/hooks'
import { MzIcon } from '#C/icon/MzIcon'
import { setViewLogin, setViewSider } from '#F/layout'
import { sessionLogout, sessionQuery } from '#F/session'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, Popconfirm } from 'antd'
import { useCallback, useEffect } from 'react'

export function AppHeader() {
  const session = useAppSelector((state) => state.session)
  const viewSider = useAppSelector((state) => state.layout.viewSider)

  const dispatch = useAppDispatch()

  const doQuery = useCallback(() => dispatch(sessionQuery()), [dispatch])

  const doLogout = useCallback(() => dispatch(sessionLogout()), [dispatch])

  const showLogin = useCallback(() => dispatch(setViewLogin(true)), [dispatch])

  const handleClick = () => dispatch(setViewSider(!viewSider))

  useEffect(() => {
    setTimeout(doQuery, 300)
    const timer = setInterval(doQuery, 600 * 1000)
    return clearInterval(timer)
  }, [doQuery])

  return (
    <Layout.Header className="app-header">
      {viewSider ? (
        <MenuFoldOutlined className="header-icon" onClick={handleClick} />
      ) : (
        <MenuUnfoldOutlined className="header-icon" onClick={handleClick} />
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
