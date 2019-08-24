import React from 'react'
import { Input, Layout, Modal } from 'antd'
import { Icon } from '../../comps/@icon/Icon'

interface FormLogin {
  username?: string
  password?: string
}

const formLogin: FormLogin = {}

interface AppFooterProps {
  viewLogin: boolean
  submiting: boolean
  setViewLogin: (viewLogin: boolean) => void
  sessionLogin: (username: string, password: string) => void
}

export function AppFooter(props: AppFooterProps) {

  function submitLogin() {
    const username = formLogin.username
    const password = formLogin.password

    if (!username) {
      Modal.warning({title: '请检查输入项', content: '你必须输入用户名称'})
      return
    }

    if (!password) {
      Modal.warning({title: '请检查输入项', content: '你必须输入用户密码'})
      return
    }

    props.sessionLogin(username, password)
  }

  function hideLogin() {
    props.setViewLogin(false)
  }

  function focusPassword() {
    (document.querySelector(':password') as HTMLInputElement).focus()
  }

  return (
    <Layout.Footer className="app-footer">
      <Modal
        title="用户登入"
        okText="登入"
        cancelText="取消"
        visible={props.viewLogin}
        confirmLoading={props.submiting}
        onOk={submitLogin}
        onCancel={hideLogin}
      >
        <div style={{padding: 10}}>
          <Input
            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
            autoFocus={true}
            onChange={e => formLogin.username = e.target.value}
            placeholder="请输入用户名称"
            onPressEnter={focusPassword}
          />
        </div>
        <div style={{padding: 10}}>
          <Input
            type="password"
            onChange={e => formLogin.password = e.target.value}
            prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
            placeholder="请输入用户密码"
          />
        </div>
      </Modal>
    </Layout.Footer>
  )
}
