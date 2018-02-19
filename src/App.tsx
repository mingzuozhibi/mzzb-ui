import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Layout, Modal } from 'antd'
import './App.css'

import { loginManager, Result } from './utils/manager'
import * as Loadable from 'react-loadable'
import { debounce } from 'lodash'
import produce from 'immer'

export interface Session {
  userName: string
  isLogged: boolean
  userRoles: string[]
}

export interface Reload {
  handle: () => void
  pending: boolean
}

export interface AppState {
  hideSider: boolean
  viewModal: boolean
  submiting: boolean
  bodyWidth: number
  session: Session
  reload?: Reload
}

export interface AppContext {
  state: AppState
  update: (reducer: (draft: AppState) => void) => void
}

const async = (loader: () => any) => {
  return Loadable({
    loader: loader,
    loading: () => null,
  })
}

const AsyncAppSider = async(() => import('./layouts/app-sider'))

const AsyncAppHeader = async(() => import('./layouts/app-header'))

const AsyncAppFooter = async(() => import('./layouts/app-footer'))

class App extends React.Component<{}, AppState> {

  static childContextTypes = {
    state: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
  }

  state: AppState = {
    hideSider: false,
    viewModal: false,
    submiting: false,
    bodyWidth: window.innerWidth,
    session: {
      userName: 'Guest',
      isLogged: false,
      userRoles: [],
    },
  }

  getChildContext() {
    return {
      state: this.state,
      update: this.update,
    }
  }

  update = (reducer: (draft: AppState) => void) => {
    this.setState((prevState => produce(prevState, reducer)))
  }

  async componentDidMount() {
    const result: Result<Session> = await loginManager.current()
    this.update(draft => {
      if (result.success) {
        draft.session = result.data
      } else {
        Modal.error({title: '获取当前登入状态异常', content: result.message})
      }
    })

    const handleResize = () => {
      this.update(draft => {
        draft.bodyWidth = window.innerWidth
      })
    }
    window.onresize = debounce(handleResize, 200)
  }

  render() {
    return (
      <div className="app-root">
        <Layout>
          <AsyncAppSider/>
          <Layout>
            <AsyncAppHeader/>
            <Layout.Content className="app-content">
              {this.props.children}
            </Layout.Content>
            <AsyncAppFooter/>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default App
