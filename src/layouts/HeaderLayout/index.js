import React from 'react'
import {connect} from 'react-redux'
import {Icon, Layout, Popconfirm} from 'antd'
import {hideSider, showLogin, showSider} from '../../reducers/layoutReducer'
import {submitCheck, submitLogout} from '../../handlers/sessionHandler'
import IconFont from '../../libraries/IconFont'

const {Header} = Layout

const sessionStyle = {
  fontSize: '18px',
  lineHeight: '64px',
  padding: '0 24px',
  cursor: 'pointer',
  float: 'right',
  transition: 'color .3s',
}

function HeaderLayout({showSider, showLogin, isLogged, handlers}) {
  const {doHideSider, doShowSider, doShowLogin, doSubmitLogout} = handlers
  const LoginIcon = (
    <IconFont
      style={sessionStyle}
      type="icon-login"
      onClick={doShowLogin}/>
  )
  const LogoutIcon = (
    <IconFont
      style={sessionStyle}
      type="icon-user"/>
  )
  const ConfirmLogout = (
    <Popconfirm
      title="你确定要登出吗？"
      placement="bottomRight"
      onConfirm={doSubmitLogout}
      okText="Yes"
      cancelText="No">
      {LogoutIcon}
    </Popconfirm>
  )
  return (
    <Header style={{background: '#fff', padding: 0}}>
      <Icon
        className="trigger"
        type={showSider ? 'menu-fold' : 'menu-unfold'}
        onClick={showSider ? doHideSider : doShowSider}
      />
      {isLogged ? ConfirmLogout : LoginIcon}
    </Header>
  )
}

function mapStateToProps(state) {
  return {
    showSider: state.layout.showSider,
    showLogin: state.layout.showLogin,
    isLogged: state.session.isLogged,
  }
}

function mapDispatchToProps(dispatch) {
  dispatch(submitCheck())
  return {
    handlers: {
      doHideSider() {
        dispatch(hideSider())
      },
      doShowSider() {
        dispatch(showSider())
      },
      doShowLogin() {
        dispatch(showLogin())
      },
      doSubmitLogout() {
        dispatch(submitLogout())
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderLayout)
