import { RouteInfo, routes } from '#A/routes'
import { Layout, Spin } from 'antd'
import { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
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
          <Layout.Content className="app-content">
            <Suspense fallback={<Spin delay={200} />}>
              <Switch>
                <Redirect exact={true} path="/" to="/disc_groups" />
                {routes.map(renderRoute)}
                <Redirect exact={true} path="*" to="/disc_groups" />
              </Switch>
            </Suspense>
          </Layout.Content>
          <AppFooter />
        </Layout>
      </Layout>
    </div>
  )
}

function renderRoute(route: RouteInfo, index: number) {
  return (
    <Route key={index} path={route.path} exact={route.exact !== false} component={route.loader} />
  )
}
