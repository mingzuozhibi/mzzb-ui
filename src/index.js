import React from 'react'
import ReactDOM from 'react-dom'
import {applyMiddleware, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {Provider} from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import {ConnectedRouter, routerMiddleware} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import setupConfig from './common/setup.js'
import CoreLayout from './layouts/CoreLayout'

const history = createHistory()
const middlewares = [routerMiddleware(history), thunkMiddleware]
const store = createStore(
  rootReducer, composeWithDevTools(applyMiddleware(...middlewares))
)

setupConfig()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <CoreLayout/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
