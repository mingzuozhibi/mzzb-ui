import React, { useEffect } from 'react'
import { Layout, Popconfirm } from 'antd'
import { Icon } from '../../comps/icon/Icon'
import { SessionState } from '../session'

interface AppHeaderProps {
  session: SessionState
  viewSider: boolean
  showLogin: () => void
  setViewSider: (viewSider: boolean) => void
  sessionLogout: () => void
  refreshSession: () => void
}

export function AppHeader(props: AppHeaderProps) {

  useEffect(() => {
    props.refreshSession()
    const id: any = setInterval(props.refreshSession, 10 * 60 * 1000)
    return clearInterval(id)
  }, [])

  return (
    <Layout.Header className="app-header">
      <Icon
        className="header-icon"
        onClick={() => props.setViewSider(!props.viewSider)}
        type={props.viewSider ? 'menu-fold' : 'menu-unfold'}
      />
      <span style={{marginLeft: 24}}>
        在线人数: {props.session.userCount}
      </span>
      {props.session.isLogged ? (
        <Popconfirm
          title="你确定要登出吗？"
          placement="bottomRight"
          okText="Yes"
          cancelText="No"
          onConfirm={props.sessionLogout}
        >
          <Icon
            className="header-icon float-right"
            type="icon-user"
          />
        </Popconfirm>
      ) : (
        <Icon
          className="header-icon float-right"
          type="icon-login"
          onClick={props.showLogin}
        />
      )}
    </Layout.Header>
  )
}
