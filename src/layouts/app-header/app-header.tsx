import * as React from 'react'
import { Layout, Modal, Popconfirm } from 'antd'
import { Icon } from '../../lib/icon'

import { AppContext, AppState, default as App } from '../../App'
import { loginManager } from '../../utils/manager'

export class AppHeader extends React.Component<{}, {}> {

  static contextTypes = App.childContextTypes

  context: AppContext

  toggleSider = () => {
    this.context.update((draft: AppState) => {
      draft.hideSider = !draft.hideSider
    })
  }

  showLogin = () => {
    this.context.update((draft: AppState) => {
      draft.viewModal = true
    })
  }

  submitLogout = async () => {
    const result = await loginManager.logout()
    if (result.success) {
      this.context.update((draft: AppState) => {
        draft.session = result.data
      })
    } else {
      Modal.error({title: '登出异常', content: result.message})
    }
  }

  render() {
    const appState = this.context.state
    return (
      <Layout.Header className="app-header">
        <Icon
          className="header-icon"
          onClick={this.toggleSider}
          type={appState.hideSider ? 'menu-unfold' : 'menu-fold'}
        />
        {appState.reload && (
          <Icon
            className="header-icon"
            type={appState.reload.pending ? 'loading' : 'reload'}
            onClick={appState.reload.handle}
          />
        )}
        {appState.session.isLogged ? (
          <Popconfirm
            title="你确定要登出吗？"
            placement="bottomRight"
            okText="Yes"
            cancelText="No"
            onConfirm={this.submitLogout}
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
            onClick={this.showLogin}
          />
        )}
      </Layout.Header>
    )
  }
}
