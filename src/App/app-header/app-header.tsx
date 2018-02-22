import * as React from 'react'
import { Layout, Popconfirm } from 'antd'
import { Icon } from '../../lib/icon'
import { Reload } from '../reducer'

interface AppHeaderProps {
  reload?: Reload
  isLogged: boolean
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
      {props.reload && (
        <Icon
          className="header-icon"
          type={props.reload.loading ? 'loading' : 'reload'}
          onClick={props.reload.refresh}
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
