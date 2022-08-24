import { Layout } from 'antd'
import './App.scss'

import { AppContent } from './app-content'
import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { AppSider } from './app-sider'

export default function App() {
  return (
    <div className="app-root">
      <Layout>
        <AppSider />
        <Layout>
          <AppHeader />
          <AppContent />
          <AppFooter />
        </Layout>
      </Layout>
    </div>
  )
}
