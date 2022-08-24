import { Layout } from 'antd'
import { routes } from './app-routes'

export function AppContent() {
  return <Layout.Content className="app-content" children={routes} />
}
