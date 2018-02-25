import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import './index.css'

import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'

import App from './App/App'
import { Load } from './lib/load'
import * as Loadable from 'react-loadable'
import { rootSagas } from './common/root-sagas'
import { rootReducer } from './common/root-reducer'
import { RouteInfo, routeInfos, Simple } from './common/route-infos'
import registerServiceWorker from './registerServiceWorker'

const history = createHistory()
const routerMid = routerMiddleware(history)
const sagaMid = createSagaMiddleware()

const store = createStore(
  rootReducer, composeWithDevTools(applyMiddleware(routerMid, sagaMid))
)

const async = (loader: () => any) => {
  return Loadable({
    loader: loader,
    loading: Load,
    delay: 300,
    timeout: 5000,
  })
}

const simpleRoutes: Simple[] = []

const renderRoute = (route: RouteInfo, key: number): React.ReactNode => {
  switch (route.type) {
    case 'Routes':
      return route.routes.map(renderRoute)
    case 'Simple':
      simpleRoutes.push(route)
      return (
        <Route key={key} path={route.path} component={async(route.component)}/>
      )
    default:
      return undefined
  }
}

export { simpleRoutes }

sagaMid.run(rootSagas)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Redirect exact={true} path="/" to="/home"/>
          {routeInfos.map(renderRoute)}
          <Redirect exact={true} path="*" to="/home?not-found"/>
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
