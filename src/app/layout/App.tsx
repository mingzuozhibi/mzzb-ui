import { routes } from '#A/routes'
import { Layout } from 'antd'
import AppFooter from './app-footer'
import AppHeader from './app-header'
import AppSider from './app-sider'
import './App.scss'

export default function App() {
  return (
    <div className="app-root">
      <Layout>
        <AppSider />
        <Layout>
          <AppHeader />
          <Layout.Content className="app-content" children={routes} />
          <AppFooter />
        </Layout>
      </Layout>
    </div>
  )
}
