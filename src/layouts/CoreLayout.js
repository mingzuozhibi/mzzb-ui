import React from 'react'
import {BackTop, Layout} from 'antd'
import SiderLayout from './SiderLayout'
import HeaderLayout from './HeaderLayout'
import LoginModal from './LoginModal'
import routes from '../routes'
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
          {routes}
        </Content>
        <Footer style={footerStyle}>
          <LoginModal/>
          <BackTop/>
        </Footer>
      </Layout>
    </Layout>
  )
}
