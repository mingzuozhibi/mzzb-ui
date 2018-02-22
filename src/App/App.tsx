import * as Loadable from 'react-loadable'
import * as React from 'react'
import { Layout } from 'antd'
import './App.css'

const async = (loader: () => any) => {
  return Loadable({
    loader: loader,
    loading: () => null,
  })
}

const AsyncAppSider = async(() => import('./app-sider'))

const AsyncAppHeader = async(() => import('./app-header'))

const AsyncAppFooter = async(() => import('./app-footer'))

interface AppProps {
  children: React.ReactNode
}

function App(props: AppProps) {
  return (
    <div className="app-root">
      <Layout>
        <AsyncAppSider/>
        <Layout>
          <AsyncAppHeader/>
          <Layout.Content className="app-content">
            {props.children}
          </Layout.Content>
          <AsyncAppFooter/>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
