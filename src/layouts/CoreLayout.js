import React from 'react'
import {Redirect, Switch} from 'react-router'
import {BackTop, Layout} from 'antd'
import LoginModal from './LoginModal'
import SiderLayout from './SiderLayout'
import HeaderLayout from './HeaderLayout'
import menu from '../common/menu'
import {isMobile} from '../utils/window'
import './CoreLayout.css'

const {Content, Footer} = Layout

function getStyles(mobile) {
  return {
    content: {
      background: '#fff',
      margin: mobile ? '0px' : '12px',
      padding: mobile ? '4px' : '12px',
      minHeight: '1000px',
    },
    footer: {
      background: '#fff',
      padding: '0px',
    }
  }
}

export default function CoreLayout() {
  const styles = getStyles(isMobile())
  return (
    <Layout>
      <SiderLayout/>
      <Layout>
        <HeaderLayout/>
        <Content style={styles.content}>
          <Switch>
            <Redirect exact path='/' to='/home'/>
            {
              menu.map(item => item.renderRoute())
            }
            <Redirect exact path='*' to='/404'/>
          </Switch>
        </Content>
        <Footer style={styles.footer}>
          <LoginModal/>
          <BackTop/>
        </Footer>
      </Layout>
    </Layout>
  )
}
