import React from 'react'
import Loadable from 'react-loadable'
import { Layout } from 'antd'
import { Load } from '../lib/load'
import './App.scss'

import { Redirect, Route, Switch } from 'react-router-dom'
import { PageInfo, pageInfos } from '../common/route-infos'

function asyncLayout(loader: () => any) {
  return Loadable({
    loader: loader,
    loading: () => null,
  })
}

const AsyncAppSider = asyncLayout(() => import('./app-sider'))

const AsyncAppHeader = asyncLayout(() => import('./app-header'))

const AsyncAppFooter = asyncLayout(() => import('./app-footer'))

export function App() {
  return (
    <div className="app-root">
      <Layout>
        <AsyncAppSider/>
        <Layout>
          <AsyncAppHeader/>
          <Layout.Content className="app-content">
            <Switch>
              <Redirect exact={true} path="/" to="/sakura"/>
              {pageInfos.map(renderRoute)}
              <Redirect exact={true} path="*" to="/sakura"/>
            </Switch>
          </Layout.Content>
          <AsyncAppFooter/>
        </Layout>
      </Layout>
    </div>
  )
}

function renderRoute(pageInfo: PageInfo, key: number): React.ReactNode {
  return (
    <Route key={key} path={pageInfo.matchPath} component={asyncComponent(pageInfo.component)}/>
  )
}

function asyncComponent(loader: () => any) {
  return Loadable({
    loader: loader,
    loading: Load,
    delay: 300,
    timeout: 5000,
  })
}
