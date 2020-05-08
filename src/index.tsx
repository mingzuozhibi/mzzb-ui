import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import { enableAllPlugins } from 'immer'

import { createRootReducer } from './@reducer'
import App from './layout/App'
import './index.scss'

enableAllPlugins()

const history = createBrowserHistory()
const routerMid = routerMiddleware(history)

const store = configureStore({
  reducer: createRootReducer(history),
  middleware: [routerMid, ...getDefaultMiddleware()]
})

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
