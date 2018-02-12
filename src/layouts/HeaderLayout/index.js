import React from 'react'
import {connect} from 'react-redux'
import {Icon, Layout, Popconfirm} from 'antd'
import {hideSider, showLogin, showSider} from '../../reducers/layoutReducer'
import {requestCheck, requestLogout} from '../../handlers/sessionHandler'
import IconFont from '../../libraries/IconFont'
import Reload from '../../libraries/Reload'

const {Header} = Layout

function loginIcon(handle) {
  return (
    <IconFont
      name="icon-login"
      type="header"
      className="float-right"
      onClick={handle}
    />
  )
}

function logoutIcon(handle) {
  return (
    <Popconfirm
      title="你确定要登出吗？"
      placement="bottomRight"
      onConfirm={handle}
      okText="Yes"
      cancelText="No">
      <IconFont
        name="icon-user"
        type="header"
        className="float-right"
      />
    </Popconfirm>
  )
}

function HeaderLayout({showSider, showLogin, isLogged, reload, handlers}) {

  const {doHideSider, doShowSider, doShowLogin, doLogout} = handlers

  return (
    <Header style={{background: '#fff', padding: 0}}>
      <Icon
        className="header-icon"
        type={showSider ? 'menu-fold' : 'menu-unfold'}
        onClick={showSider ? doHideSider : doShowSider}
      />
      {reload && (
        <Reload
          key="reload"
          action={reload.action}
          isPending={reload.isPending}
        />
      )}
      {isLogged ? logoutIcon(doLogout) : loginIcon(doShowLogin)}
    </Header>
  )
}

function mapStateToProps(state) {
  return {
    showSider: state.layout.showSider,
    showLogin: state.layout.showLogin,
    isLogged: state.session.isLogged,
    reload: state.layout.reload,
  }
}

function mapDispatchToProps(dispatch) {
  dispatch(requestCheck())
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
      doLogout() {
        dispatch(requestLogout())
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderLayout)
