import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.scss'

import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore } from 'redux'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import App from './App'
import { cleanup } from './utils/cleanup'
import { rootSagas } from './common/root-sagas'
import { createRootReducer } from './common/root-reducer'

cleanup('v0.27.2')

const history = createBrowserHistory()
const routerMid = routerMiddleware(history)
const sagaMid = createSagaMiddleware()

const store = createStore(
  createRootReducer(history), composeWithDevTools(applyMiddleware(routerMid, sagaMid))
)

sagaMid.run(rootSagas)

const handler = () => store.dispatch({type: 'sessionQueryRequest'})

setTimeout(handler, 500)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
