import React from 'react'
import { Layout, message, Popconfirm } from 'antd'
import { Session } from '../reducer'
import { Reload } from '../../common/reducers/current'
import { Icon } from '../../lib/icon'

interface AppHeaderProps {
  reload?: Reload
  session: Session
  viewSider: boolean
  showLogin: () => void
  setViewSider: (viewSider: boolean) => void
  reloadRequest: () => void
  sessionLogout: () => void
}

export function AppHeader(props: AppHeaderProps) {

  function reloadRequest() {
    message.info('已发起更新')
    props.reloadRequest()
  }

  return (
    <Layout.Header className="app-header">
      <Icon
        className="header-icon"
        onClick={() => props.setViewSider(!props.viewSider)}
        type={props.viewSider ? 'menu-fold' : 'menu-unfold'}
      />
      {props.reload && (
        <Icon
          className="header-icon"
          type={props.reload.loading ? 'loading' : 'reload'}
          onClick={reloadRequest}
        />
      )}
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
