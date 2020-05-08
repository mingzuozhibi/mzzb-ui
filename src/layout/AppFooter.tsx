import React from 'react'
import { useDispatch } from 'react-redux'
import { useLayoutSelector, setViewLogin } from '../reducers/layout'
import { encodePasswd } from '../@version/passwd'
import { loginRequest } from '../reducers/token'

import { Input, Layout, Modal } from 'antd'
import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import { CustomIcon } from '../comps/CustomIcon'
import { CustomLink } from '../comps/CustomLink'


interface FormLogin {
  username?: string
  password?: string
}

const formLogin: FormLogin = {}

export default function AppFooter() {

  const dispatch = useDispatch()
  const viewLogin = useLayoutSelector(state => state.viewLogin)

  function submitLogin() {
    const username = formLogin.username
    const password = formLogin.password

    if (!username) {
      Modal.warning({ title: '请检查输入项', content: '你必须输入用户名称' })
      return
    }

    if (!password) {
      Modal.warning({ title: '请检查输入项', content: '你必须输入用户密码' })
      return
    }

    dispatch(loginRequest(username, encodePasswd(username, password)))
  }

  function focusPassword() {
    (document.querySelector(':password') as HTMLInputElement).focus()
  }

  return (
    <Layout.Footer className="app-footer">
      <div id="beian" style={{ textAlign: 'center' }}>
        <CustomLink href="http://beian.miit.gov.cn" title="鲁ICP备16016069号-1" />
      </div>
      <Modal
        title="用户登入"
        okText="登入"
        cancelText="取消"
        onOk={submitLogin}
        onCancel={() => dispatch(setViewLogin(false))}
        visible={viewLogin}
      >
        <div style={{ padding: 10 }}>
          <Input
            prefix={<CustomIcon iconNode={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />}
            autoFocus={true}
            onChange={e => formLogin.username = e.target.value}
            placeholder="请输入用户名称"
            onPressEnter={focusPassword}
          />
        </div>
        <div style={{ padding: 10 }}>
          <Input
            type="password"
            onChange={e => formLogin.password = e.target.value}
            prefix={<CustomIcon iconNode={<KeyOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />}
            placeholder="请输入用户密码"
          />
        </div>
      </Modal>
    </Layout.Footer>
  )
}
