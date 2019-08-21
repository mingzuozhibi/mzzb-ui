import React from 'react'
import { Layout, Popconfirm } from 'antd'
import { Session } from '../reducer'
import { Icon } from '../../comps/icon/Icon'

interface AppHeaderProps {
  session: Session
  viewSider: boolean
  showLogin: () => void
  setViewSider: (viewSider: boolean) => void
  sessionLogout: () => void
}

export function AppHeader(props: AppHeaderProps) {

  return (
    <Layout.Header className="app-header">
      <Icon
        className="header-icon"
        onClick={() => props.setViewSider(!props.viewSider)}
        type={props.viewSider ? 'menu-fold' : 'menu-unfold'}
      />
      <span style={{marginLeft: 24}}>
        在线人数: {props.session.onlineUserCount}
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
