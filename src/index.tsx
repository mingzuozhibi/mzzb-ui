import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import './index.css'

import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'

import App from './App'
import { cleanup } from './utils/cleanup'
import { rootSagas } from './common/root-sagas'
import { rootReducer } from './common/root-reducer'

cleanup('v0.27.2')

const history = createHistory()
const routerMid = routerMiddleware(history)
const sagaMid = createSagaMiddleware()

const store = createStore(
  rootReducer, composeWithDevTools(applyMiddleware(routerMid, sagaMid))
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
