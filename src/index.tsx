import { composeWithDevTools } from '@redux-devtools/extension'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { enableMapSet } from 'immer'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import App from './app/layout/App'
import { createRootReducer } from './app/reducer'
import { sagas } from './app/sagas'
import './index.scss'

enableMapSet()

const history = createBrowserHistory()
const routerMid = routerMiddleware(history)
const sagaMid = createSagaMiddleware()

const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(routerMid, sagaMid))
)

sagaMid.run(sagas)

const MyRouter: any = ConnectedRouter

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MyRouter history={history}>
        <App />
      </MyRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
)
