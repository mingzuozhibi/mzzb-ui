import React from 'react'
import { Input, Layout, Modal } from 'antd'
import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import { CustomIcon } from '../../comps/CustomIcon'
import { CustomLink } from '../../comps/CustomLink'

interface FormLogin {
  username?: string
  password?: string
}

const formLogin: FormLogin = {}

interface AppFooterProps {
  viewLogin: boolean
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
      <div id="beian" style={{textAlign: 'center'}}>
        <CustomLink href="http://beian.miit.gov.cn" title="鲁ICP备16016069号-1" />
      </div>
      <Modal
        title="用户登入"
        okText="登入"
        cancelText="取消"
        onOk={submitLogin}
        onCancel={hideLogin}
        visible={props.viewLogin}
      >
        <div style={{padding: 10}}>
          <Input
            prefix={<CustomIcon iconNode={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}/>}
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
            prefix={<CustomIcon iconNode={<KeyOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}/>}
            placeholder="请输入用户密码"
          />
        </div>
      </Modal>
    </Layout.Footer>
  )
}
