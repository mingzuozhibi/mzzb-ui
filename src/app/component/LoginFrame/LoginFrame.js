import React from 'react'
import {Icon, Input, Modal} from 'antd'

function LoginFrame({isOpened, doHideLogin, doSubmit}) {

  function handleSubmit() {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    doSubmit(username, password)
  }

  return (
    <div id="login_frame">
      <Modal
        title="用户登入"
        okText="登入"
        cancelText="取消"
        visible={isOpened}
        onOk={handleSubmit}
        onCancel={doHideLogin}
      >
        <Input
          id="username"
          prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder="请输入用户名"
        />
        <Input
          id="password"
          type="password"
          prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder="请输入密码"
        />
      </Modal>
    </div>
  )
}

export default LoginFrame
