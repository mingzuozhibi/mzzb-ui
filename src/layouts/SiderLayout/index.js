import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Layout, Menu} from 'antd'
import menu, {link} from '../../common/menu'

const {Sider} = Layout

function SiderLayout({pathname, showSider, doSelectItem, doRedirectTo}) {
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
        onSelect={({key}) => {
          if (key[0] === '/')
            doSelectItem(key)
          else
            doRedirectTo(key)
        }}
      >
        {menu.map(m => (
          <Menu.Item key={m.path}>
            {m.icon}<span>{m.title}</span>
          </Menu.Item>
        ))}
        {link.map(m => (
          <Menu.Item key={m.path}>
            {m.icon}<span>{m.title}</span>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  )
}

function mapStateToProps(state) {
  return {
    pathname: state.router.location.pathname,
    showSider: state.layout.showSider,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    doSelectItem(path) {
      dispatch(push(path))
    },
    doRedirectTo(path) {
      window.open(path)
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiderLayout)
