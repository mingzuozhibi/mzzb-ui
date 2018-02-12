import React from 'react'
import {push} from 'react-router-redux'
import {Layout, Menu} from 'antd'
import {isMobile} from '../../utils/window'
import {hideSider} from '../../reducers/layoutReducer'
import menu from '../../common/menu'
import connect from '../../utils/connect'

const {Sider} = Layout

function SiderLayout({isAdmin, pathname, showSider, dispatch}) {

  function handleClick({key}) {
    if (key[0] === '/') {
      dispatch(push(key))
    } else {
      window.open(key)
    }
    if (isMobile())
      dispatch(hideSider())
  }

  return (
    <Sider
      width={200}
      trigger={null}
      collapsible={true}
      collapsedWidth={0}
      collapsed={!showSider}
      style={{background: '#fff'}}>
      <div className="sider-logo">
        <h2>名作之壁</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        style={{height: '100%'}}
        onSelect={handleClick}
      >
        {menu.map(item => item.renderMenu(isAdmin))}
      </Menu>
    </Sider>
  )
}

function mapState(state) {
  return {
    isAdmin: state.session.isAdmin,
    pathname: state.router.location.pathname,
    showSider: state.layout.showSider,
  }
}

export default connect(mapState, undefined, SiderLayout)
