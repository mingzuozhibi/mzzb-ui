import React, { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import { RouteInfo, routes } from '../@routes'
import './App.scss'

import AppSider from './app-sider'
import AppHeader from './app-header'
import AppFooter from './app-footer'

export default function App() {

  return (
    <div className="app-root">
      <Layout>
        <AppSider/>
        <Layout>
          <AppHeader/>
          <Layout.Content className="app-content">
            <Suspense fallback={<Spin delay={200}/>}>
              <Switch>
                <Redirect exact={true} path="/" to="/disc_groups"/>
                {routes.map(renderRoute)}
                <Redirect exact={true} path="*" to="/disc_groups"/>
              </Switch>
            </Suspense>
          </Layout.Content>
          <AppFooter/>
        </Layout>
      </Layout>
    </div>
  )
}

function renderRoute(route: RouteInfo, index: number) {
  return <Route key={index} path={route.path} exact={route.exact !== false} component={lazy(route.loader)}/>
}
