import * as React from 'react'
import * as Loadable from 'react-loadable'
import { Layout } from 'antd'
import { Load } from '../lib/load'
import './App.css'

import { Redirect, Route, Switch } from 'react-router'
import { PageInfo } from '../common/root-reducer'
import { pageInfos } from '../common/menu-infos'

function asyncLayout(loader: () => any) {
  return Loadable({
    loader: loader,
    loading: () => null,
  })
}

const AsyncAppSider = asyncLayout(() => import('./app-sider'))

const AsyncAppHeader = asyncLayout(() => import('./app-header'))

const AsyncAppFooter = asyncLayout(() => import('./app-footer'))

const asyncHome = asyncComponent(() => import('../components/home'))

export function App() {
  return (
    <div className="app-root">
      <Layout>
        <AsyncAppSider/>
        <Layout>
          <AsyncAppHeader/>
          <Layout.Content className="app-content">
            <Switch>
              <Redirect exact={true} path="/" to="/home"/>
              <Route path="/home" component={asyncHome}/>
              {pageInfos.map(renderRoute)}
              <Redirect exact={true} path="*" to="/home?not-found"/>
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
