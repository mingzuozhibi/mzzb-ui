import * as React from 'react'
import { Layout, Modal, Popconfirm } from 'antd'
import Icon from '../../lib/icon'

import { AppState, default as App } from '../../App'
import { loginManager } from '../../utils/manager'

export class AppHeader extends React.Component<{}, {}> {

  static contextTypes = App.childContextTypes

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
    return (
      <Layout.Header className="app-header">
        <Icon
          className="header-icon"
          onClick={this.toggleSider}
          type={this.context.state.hideSider ? 'menu-unfold' : 'menu-fold'}
        />
        {this.context.state.reload && (
          <Icon
            className="header-icon"
            type={this.context.state.reload.pending ? 'loading' : 'reload'}
            onClick={this.context.state.reload.handle}
          />
        )}
        {this.context.state.session.isLogged ? (
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
