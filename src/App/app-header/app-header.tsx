import * as React from 'react'
import { Layout, Popconfirm } from 'antd'
import { CurrentState } from '../../common/reducers/current'
import { Icon } from '../../lib/icon'

interface AppHeaderProps {
  current: CurrentState
  isLogged: boolean
  viewSider: boolean
  showLogin: () => void
  setViewSider: (viewSider: boolean) => void
  reloadRequest: () => void
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
      {props.current.reload && (
        <Icon
          className="header-icon"
          type={props.current.reload.loading ? 'loading' : 'reload'}
          onClick={props.reloadRequest}
        />
      )}
      {props.isLogged ? (
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
