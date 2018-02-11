import React from 'react'
import {connect} from 'react-redux'
import {Dropdown, Icon, Layout, Popconfirm} from 'antd'
import {hideSider, showLogin, showSider} from '../../reducers/layoutReducer'
import {submitCheck, submitLogout} from '../../handlers/sessionHandler'
import IconFont from '../../libraries/IconFont'

const {Header} = Layout

function HeaderLayout({showSider, showLogin, isLogged, handlers, menu}) {
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
      {menu && (
        <span className="header-icon">
          <Dropdown overlay={menu} placement="bottomCenter">
            <Icon type="profile"/>
          </Dropdown>
        </span>
      )}
      {isLogged ? ConfirmLogout : LoginIcon}
    </Header>
  )
}

function mapStateToProps(state) {
  return {
    showSider: state.layout.showSider,
    showLogin: state.layout.showLogin,
    isLogged: state.session.isLogged,
    menu: state.layout.menu,
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
