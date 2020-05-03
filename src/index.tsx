import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.scss'

import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore } from 'redux'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import App from './layout/App'
import { sagas } from './@sagas'
import { createRootReducer } from './@reducer'
import { enableAllPlugins } from 'immer'

enableAllPlugins()

const history = createBrowserHistory()
const routerMid = routerMiddleware(history)
const sagaMid = createSagaMiddleware()

const store = createStore(
  createRootReducer(history), composeWithDevTools(applyMiddleware(routerMid, sagaMid))
)

sagaMid.run(sagas)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
