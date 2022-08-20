import { MzIcon } from '#C/icon/MzIcon'
import { SessionState } from '#F/session'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, Popconfirm } from 'antd'
import { useEffect } from 'react'

interface AppHeaderProps {
  session: SessionState
  viewSider: boolean
  showLogin: () => void
  setViewSider: (viewSider: boolean) => void
  sessionLogout: () => void
  refreshSession: () => void
}

export function AppHeader(props: AppHeaderProps) {
  const { session, viewSider, showLogin, setViewSider, sessionLogout, refreshSession } = props

  useEffect(() => {
    setTimeout(() => {
      refreshSession()
    }, 300)
    const id: any = setInterval(refreshSession, 10 * 60 * 1000)
    return clearInterval(id)
  }, [refreshSession])

  return (
    <Layout.Header className="app-header">
      <MzIcon
        iconNode={viewSider ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        className="header-icon"
        onClick={() => setViewSider(!viewSider)}
      />
      <span style={{ marginLeft: 24 }}>在线人数: {session.userCount}</span>
      {session.isLogged ? (
        <Popconfirm
          title="你确定要登出吗？"
          okText="OK"
          cancelText="Cancel"
          placement="bottomRight"
          onConfirm={sessionLogout}
        >
          <MzIcon iconType="icon-user" className="header-icon float-right" />
        </Popconfirm>
      ) : (
        <MzIcon iconType="icon-login" className="header-icon float-right" onClick={showLogin} />
      )}
    </Layout.Header>
  )
}