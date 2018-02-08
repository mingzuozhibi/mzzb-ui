import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Layout, Menu} from 'antd'
import menu, {link} from '../../common/menu'
import {isMobile} from '../../utils/window'
import {hideSider} from '../../reducers/layoutReducer'

const {Sider} = Layout
const {SubMenu, Item} = Menu

function isActive(item, isAdmin) {
  return !item.notItem && (isAdmin || !item.isAdmin)
}

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
        {menu.map(item => isActive(item, isAdmin) && (
          item.hasSub ? renderSubMenu(item) : renderItem(item)
        ))}
        {link.map(item => (
          renderItem(item)
        ))}
      </Menu>
    </Sider>
  )
}

function renderSubMenu(menu) {
  return (
    <SubMenu key={menu.path} title={<span>{menu.icon}<span>{menu.title}</span></span>}>
      {menu.subItems.map(renderItem)}
    </SubMenu>
  )
}

function renderItem(item) {
  return (
    <Item key={item.path}>
      <span>{item.icon}<span>{item.title}</span></span>
    </Item>
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
