import * as React from 'react'
import { Input, Layout, message, Modal } from 'antd'
import { Icon } from '../../lib/icon'

import { AppContext, AppState, default as App } from '../../App'
import { loginManager } from '../../utils/manager'
import produce from 'immer'

interface FooterState {
  submiting: boolean
}

export class AppFooter extends React.Component {

  static contextTypes = App.childContextTypes

  context: AppContext

  state: FooterState = {submiting: false}

  submitLogin = async () => {
    const username = (document.querySelector('#login-username') as HTMLInputElement).value
    const password = (document.querySelector('#login-password') as HTMLInputElement).value

    if (!username || !password) {
      Modal.warning({title: '请检查输入项', content: '你必须输入用户名和密码'})
      return
    }

    this.update(draft => draft.submiting = true)

    const result = await loginManager.login(username, password)

    this.update(draft => draft.submiting = false)

    if (result.success) {
      message.success(`您已成功登入`)
      this.context.update((draft: AppState) => {
        draft.viewModal = false
        draft.session = result.data
      })

      const appState = this.context.state
      if (appState.reload) {
        setTimeout(appState.reload.handle)
      }
    } else {
      Modal.error({title: '登入异常', content: result.message})
    }
  }

  hideLogin = () => {
    this.context.update((draft: AppState) => {
      draft.viewModal = false
    })
  }

  update = (reducer: (draft: FooterState) => void) => {
    this.setState((prevState => produce(prevState, reducer)))
  }

  render() {
    const appState = this.context.state
    return (
      <Layout.Footer className="app-footer">
        {appState.viewModal && (
          <Modal
            title="用户登入"
            okText="登入"
            cancelText="取消"
            visible={appState.viewModal}
            confirmLoading={this.state.submiting}
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
