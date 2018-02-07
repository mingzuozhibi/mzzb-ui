import React from 'react'
import {connect} from 'react-redux'
import {Icon, Input, Modal} from 'antd'
import {hideLogin} from '../../reducers/layoutReducer'
import {submitLogin} from '../../handlers/sessionHandler'
import {alertWarning} from '../../utils/window'

function LoginModal({showLogin, doHideLogin, doSubmitLogin}) {

  function handleSubmit() {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    doSubmitLogin(username, password)
  }

  return (
    <Modal
      title="用户登入"
      okText="登入"
      cancelText="取消"
      visible={showLogin}
      onOk={handleSubmit}
      onCancel={doHideLogin}
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
        onPressEnter={handleSubmit}
      />
    </Modal>
  )
}

function mapStateToProps(state) {
  return {
    showLogin: state.layout.showLogin,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doHideLogin() {
      dispatch(hideLogin())
    },
    doSubmitLogin(username, password) {
      if (!username || !password) {
        alertWarning('请检查输入项', '你必须输入用户名和密码')
      } else {
        dispatch(submitLogin(username, password))
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal)
