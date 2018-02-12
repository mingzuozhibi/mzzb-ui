import React from 'react'
import {Icon, Layout, Popconfirm} from 'antd'
import Reload from '../Reload'
import {Font} from '../../libraries'
import {hideSider, showLogin, showSider} from '../../reducers/layoutReducer'
import {logout, query} from '../../handlers/sessionHandler'
import connect from '../../utils/connect'

const {Header} = Layout

function loginIcon(handle) {
  return (
    <Font
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
      <Font
        name="icon-user"
        type="header"
        className="float-right"
      />
    </Popconfirm>
  )
}

function HeaderLayout({viewSider, isLogged, reload, dispatch}) {

  return (
    <Header style={{background: '#fff', padding: 0}}>
      <Icon
        className="header-icon"
        type={viewSider ? 'menu-fold' : 'menu-unfold'}
        onClick={viewSider ? () => dispatch(hideSider()) : () => dispatch(showSider())}
      />
      {reload && (
        <Reload
          key="reload"
          action={reload.action}
          isPending={reload.isPending}
        />
      )}
      {isLogged ? logoutIcon(() => dispatch(logout())) : loginIcon(() => dispatch(showLogin()))}
    </Header>
  )
}

function mapState(state) {
  return {
    viewSider: state.layout.showSider,
    isLogged: state.session.isLogged,
    reload: state.layout.reload,
  }
}

export default connect(mapState, (dispatch) => {
  dispatch(query())
}, HeaderLayout)
