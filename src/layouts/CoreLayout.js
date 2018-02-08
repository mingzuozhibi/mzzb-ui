import React from 'react'
import {Redirect, Switch} from 'react-router'
import {BackTop, Layout} from 'antd'
import LoginModal from './LoginModal'
import SiderLayout from './SiderLayout'
import HeaderLayout from './HeaderLayout'
import menu from '../common/menu'
import './CoreLayout.css'

const {Content, Footer} = Layout

const contentStyle = {background: '#fff', margin: 12, padding: 12, minHeight: '1000px'}
const footerStyle = {background: '#fff', padding: 0}

export default function CoreLayout() {
  return (
    <Layout>
      <SiderLayout/>
      <Layout>
        <HeaderLayout/>
        <Content style={contentStyle}>
          <Switch>
            <Redirect exact path='/' to='/home'/>
            {
              menu.map(item => item.renderRoute())
            }
            <Redirect exact path='*' to='/404'/>
          </Switch>
        </Content>
        <Footer style={footerStyle}>
          <LoginModal/>
          <BackTop/>
        </Footer>
      </Layout>
    </Layout>
  )
}
