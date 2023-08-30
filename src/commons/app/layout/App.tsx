import { Layout, Modal } from 'antd'
import './App.scss'

import { AppContent } from './app-content'
import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { AppLogin } from './app-login'
import { AppSider } from './app-sider'
import { useSession } from '#CH/useLocal'

export default function App() {
  const [show, setShow] = useSession('closesite-warning', true)
  if (show) {
    setShow(false)
    Modal.warn({ title: '闭站通知', content: '因无法继续抓取日亚数据，网站即将关闭' })
  }
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
