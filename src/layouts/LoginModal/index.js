import React from 'react'
import {Icon, Input, Modal} from 'antd'
import {hideLogin} from '../../reducers/layoutReducer'
import {login} from '../../handlers/sessionHandler'
import {alertWarning} from '../../utils/window'
import connect from '../../utils/connect'

function LoginModal({showLogin, dispatch}) {

  function handleLogin() {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    if (!username || !password) {
      alertWarning('请检查输入项', '你必须输入用户名和密码')
    } else {
      dispatch(login(username, password))
    }
  }

  return (
    <Modal
      title="用户登入"
      okText="登入"
      cancelText="取消"
      visible={showLogin}
      onOk={handleLogin}
      onCancel={() => dispatch(hideLogin())}
    >
      <Input
        id="username"
        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
        placeholder="请输入用户名"
        onPressEnter={() => document.querySelector('#password').focus()}
      />
      <Input
        id="password"
        type="password"
        prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
        placeholder="请输入密码"
        onPressEnter={handleLogin}
      />
    </Modal>
  )
}

function mapState(state) {
  return {
    showLogin: state.layout.showLogin,
  }
}

export default connect(mapState, undefined, LoginModal)
