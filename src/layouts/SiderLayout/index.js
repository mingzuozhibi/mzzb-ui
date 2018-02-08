import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Layout, Menu} from 'antd'
import {isMobile} from '../../utils/window'
import {hideSider} from '../../reducers/layoutReducer'
import menu from '../../common/menu'

const {Sider} = Layout

function SiderLayout({isAdmin, pathname, showSider, doSelectItem}) {
  return (
    <Sider
      width={200}
      trigger={null}
      collapsible={true}
      collapsedWidth={0}
      collapsed={!showSider}
      style={{background: '#fff'}}>
      <div className="logo">
        <h2>名作之壁</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        style={{height: '100%'}}
        onSelect={doSelectItem}
      >
        {menu.map(item => item.renderMenu(isAdmin))}
      </Menu>
    </Sider>
  )
}

function mapStateToProps(state) {
  return {
    isAdmin: state.session.isAdmin,
    pathname: state.router.location.pathname,
    showSider: state.layout.showSider,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doSelectItem({key}) {
      if (key[0] === '/') {
        dispatch(push(key))
        if (isMobile()) {
          dispatch(hideSider())
        }
      } else {
        window.open(key)
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiderLayout)
