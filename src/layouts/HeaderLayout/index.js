import React from 'react'
import {connect} from 'react-redux'
import {Icon, Layout, Popconfirm} from 'antd'
import {hideSider, showLogin, showSider} from '../../reducers/layoutReducer'
import {submitCheck, submitLogout} from '../../handlers/sessionHandler'
import IconFont from '../../libraries/IconFont'

const {Header} = Layout

function HeaderLayout({showSider, showLogin, isLogged, handlers, icons}) {
  const {doHideSider, doShowSider, doShowLogin, doSubmitLogout} = handlers
  const LoginIcon = (
    <IconFont
      name="icon-login"
      type="header"
      className="float-right"
      onClick={doShowLogin}
    />
  )
  const LogoutIcon = (
    <IconFont
      name="icon-user"
      type="header"
      className="float-right"
    />
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
        className="header-icon"
        type={showSider ? 'menu-fold' : 'menu-unfold'}
        onClick={showSider ? doHideSider : doShowSider}
      />
      {icons}
      {isLogged ? ConfirmLogout : LoginIcon}
    </Header>
  )
}

function mapStateToProps(state) {
  return {
    showSider: state.layout.showSider,
    showLogin: state.layout.showLogin,
    isLogged: state.session.isLogged,
    icons: state.layout.icons,
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
