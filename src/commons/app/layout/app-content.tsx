import { Layout } from 'antd'
import { routes } from '../routes'

export function AppContent() {
  return <Layout.Content className="app-content" children={routes} />
}
