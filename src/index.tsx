import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.scss'

import { createBrowserHistory } from 'history'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'

import App from './layout/App'
import { sagas } from './@sagas'
import { createRootReducer } from './@reducer'
import { enableAllPlugins } from 'immer'
import { configureStore } from "@reduxjs/toolkit";

enableAllPlugins()

const history = createBrowserHistory()
const routerMid = routerMiddleware(history)
const sagaMid = createSagaMiddleware()

const store = configureStore({
  reducer: createRootReducer(history),
  middleware: [routerMid, sagaMid]
})

sagaMid.run(sagas)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
