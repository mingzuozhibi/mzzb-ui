import React from 'react'
import {Icon, Layout, Menu} from 'antd'
import IconFont from '../component/IconFont'
import './App.css'

const {Header, Content, Sider} = Layout

function App({children, showSider, doHideSider, doShowSider, pathname, doSelectItem}) {
  return (
    <Layout>
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
          defaultSelectedKeys={[pathname]}
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
      <Layout>
        <Header style={{background: '#fff', padding: 0}}>
          <Icon
            className="trigger"
            type={showSider ? 'menu-fold' : 'menu-unfold'}
            onClick={showSider ? doHideSider : doShowSider}
          />
        </Header>
        <Content style={{background: '#fff', margin: 12, padding: 12, minHeight: '1000px'}}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
