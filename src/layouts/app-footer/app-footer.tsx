import * as React from 'react'
import { Input, Layout, message, Modal } from 'antd'
import Icon from '../../lib/icon'

import { AppState, default as App } from '../../App'
import { loginManager } from '../../utils/manager'

export class AppFooter extends React.Component<{}, {}> {

  static contextTypes = App.childContextTypes

  submitLogin = async () => {
    const username = (document.querySelector('#login-username') as HTMLInputElement).value
    const password = (document.querySelector('#login-password') as HTMLInputElement).value

    if (!username || !password) {
      Modal.warning({title: '请检查输入项', content: '你必须输入用户名和密码'})
      return
    }

    this.context.update((draft: AppState) => {
      draft.submiting = true
    })

    const result = await loginManager.login(username, password)

    this.context.update((draft: AppState) => {
      if (result.success) {
        draft.session = result.data
        draft.submiting = false
        draft.viewModal = false
        if (draft.session.isLogged) {
          message.success(`您已成功登入`)
        }
        if (draft.reload) {
          setTimeout(this.context.state.reload.handle)
        }
      } else {
        draft.submiting = false
        Modal.error({title: '登入异常', content: result.message})
      }
    })
  }

  hideLogin = () => {
    this.context.update((draft: AppState) => {
      draft.viewModal = false
    })
  }

  render() {
    return (
      <Layout.Footer className="app-footer">
        {this.context.state.viewModal && (
          <Modal
            title="用户登入"
            okText="登入"
            cancelText="取消"
            visible={this.context.state.viewModal}
            confirmLoading={this.context.state.submiting}
            onOk={this.submitLogin}
            onCancel={this.hideLogin}
          >
            <div style={{padding: 10}}>
              <Input
                id="login-username"
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="请输入用户名"
                onPressEnter={() => (document.querySelector('#login-password') as HTMLInputElement).focus()}
              />
            </div>
            <div style={{padding: 10}}>
              <Input
                id="login-password"
                type="password"
                prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="请输入密码"
                onPressEnter={this.submitLogin}
              />
            </div>
          </Modal>
        )}
      </Layout.Footer>
    )
  }
}
