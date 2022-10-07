import { Layout } from 'antd'
import './App.scss'

import { AppContent } from './app-content'
import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { AppLogin } from './app-login'
import { AppSider } from './app-sider'

export default function App() {
  return (
    <div className="app-root">
      <Layout>
        <AppSider />
        <Layout>
          <AppHeader />
          <AppLogin />
          <AppContent />
          <AppFooter />
        </Layout>
      </Layout>
    </div>
  )
}
