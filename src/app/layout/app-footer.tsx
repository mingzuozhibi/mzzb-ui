import { useAppDispatch, useAppSelector } from '#A/hooks'
import { MzLink } from '#C/link/MzLink'
import { encodePassword } from '#U/domain'
import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import { Input, Layout, Modal } from 'antd'
import { useCallback, useRef } from 'react'

import { setViewLogin } from '#F/layout'
import { sessionLogin } from '#F/session'

interface Form {
  username?: string
  password?: string
}

export function AppFooter() {
  const viewLogin = useAppSelector((state) => state.layout.viewLogin)
  const submiting = useAppSelector((state) => state.layout.submiting)
  const form = useRef<Form>({})

  const dispatch = useAppDispatch()
  const hideLogin = useCallback(() => dispatch(setViewLogin(false)), [dispatch])

  function submitLogin() {
    const username = form.current.username
    const password = form.current.password

    if (!username) {
      Modal.warning({ title: '请检查输入项', content: '你必须输入用户名称' })
      return
    }

    if (!password) {
      Modal.warning({ title: '请检查输入项', content: '你必须输入用户密码' })
      return
    }

    const encode = encodePassword(username, password)
    dispatch(sessionLogin({ username, password: encode }))
  }

  return (
    <Layout.Footer className="app-footer">
      <div id="beian" style={{ textAlign: 'center' }}>
        <MzLink href="http://beian.miit.gov.cn" title="鲁ICP备16016069号-1" />
      </div>
      <Modal
        title="用户登入"
        okText="登入"
        cancelText="取消"
        visible={viewLogin}
        confirmLoading={submiting}
        onOk={submitLogin}
        onCancel={hideLogin}
      >
        <div style={{ padding: 10 }}>
          <Input
            prefix={<UserOutlined />}
            autoFocus={true}
            onChange={(e) => {
              form.current.username = e.target.value.trim()
            }}
            placeholder="请输入用户名称"
            onPressEnter={focusPassword}
          />
        </div>
        <div style={{ padding: 10 }}>
          <Input
            prefix={<KeyOutlined />}
            type="password"
            onChange={(e) => {
              form.current.password = e.target.value.trim()
            }}
            placeholder="请输入用户密码"
            onPressEnter={submitLogin}
          />
        </div>
      </Modal>
    </Layout.Footer>
  )
}

function focusPassword() {
  ;(document.querySelector('input[type=password]') as HTMLInputElement).focus()
}
