import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Icon, Layout, Menu} from 'antd'
import IconFont from '../../libraries/IconFont'

const {Sider} = Layout

function SiderLayout({pathname, showSider, doSelectItem}) {
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
        onSelect={({key}) => doSelectItem(key)}
      >
        <Menu.Item key="/home">
          <Icon type="home"/>
          <span>Home</span>
        </Menu.Item>
        <Menu.Item key="/sakura">
          <IconFont type="icon-yinghua"/>
          <span>Sakura</span>
        </Menu.Item>
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiderLayout)
