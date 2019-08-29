import React, { useEffect } from 'react'
import { Layout, Popconfirm } from 'antd'
import { MenuFold, MenuUnfold } from '@ant-design/icons'
import { CustomIcon } from '../../comps/CustomIcon'
import { SessionState } from '../../reducers/session'

interface AppHeaderProps {
  session: SessionState
  viewSider: boolean
  showLogin: () => void
  setViewSider: (viewSider: boolean) => void
  sessionLogout: () => void
  refreshSession: () => void
}

export function AppHeader(props: AppHeaderProps) {

  const {session, viewSider, showLogin, setViewSider, sessionLogout, refreshSession} = props

  useEffect(() => {
    refreshSession()
    const id: any = setInterval(refreshSession, 10 * 60 * 1000)
    return clearInterval(id)
  }, [refreshSession])

  return (
    <Layout.Header className="app-header">
      <CustomIcon iconNode={viewSider ? <MenuFold/> : <MenuUnfold/>}
                  className="header-icon" onClick={() => setViewSider(!viewSider)}/>
      <span style={{marginLeft: 24}}>在线人数: {session.userCount}</span>
      {session.isLogged ? (
        <Popconfirm title="你确定要登出吗？" okText="OK" cancelText="Cancel" placement="bottomRight" onConfirm={sessionLogout}>
          <CustomIcon iconType="icon-user" className="header-icon float-right"/>
        </Popconfirm>
      ) : (
        <CustomIcon iconType="icon-login" className="header-icon float-right" onClick={showLogin}/>
      )}
    </Layout.Header>
  )
}
