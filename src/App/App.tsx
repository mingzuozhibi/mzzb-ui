import React, { lazy, Suspense } from 'react'
import { Layout, Spin } from 'antd'
import './App.scss'

import { Redirect, Route, Switch } from 'react-router-dom'
import { PageInfo, pageInfos } from '../common/route-infos'
import { RouteInfo, routes } from '../_New/routes'

function asyncLayout(loader: () => any) {
  const AsyncLayout = lazy(loader)
  return (
    <Suspense fallback={<Spin delay={200}/>}>
      <AsyncLayout/>
    </Suspense>
  )
}

const AsyncAppSider = asyncLayout(() => import('./app-sider'))

const AsyncAppHeader = asyncLayout(() => import('./app-header'))

const AsyncAppFooter = asyncLayout(() => import('./app-footer'))

export function App() {

  return (
    <div className="app-root">
      <Layout>
        {AsyncAppSider}
        <Layout>
          {AsyncAppHeader}
          <Layout.Content className="app-content">
            <Suspense fallback={<Spin delay={200}/>}>
              <Switch>
                <Redirect exact={true} path="/" to="/disc_groups"/>
                {routes.map(renderNewRoute)}
                {pageInfos.map(renderRoute)}
                <Redirect exact={true} path="*" to="/disc_groups"/>
              </Switch>
            </Suspense>
          </Layout.Content>
          {AsyncAppFooter}
        </Layout>
      </Layout>
    </div>
  )
}

function renderNewRoute(route: RouteInfo, index: number) {
  return <Route key={index} path={route.path} component={lazy(route.loader)}/>
}

function renderRoute(pageInfo: PageInfo, key: number): React.ReactNode {
  return (
    <Route key={key} path={pageInfo.matchPath} component={lazy(pageInfo.component)}/>
  )
}
