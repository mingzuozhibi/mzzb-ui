import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {browserHistory, Router} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import route from './app/route'
import store from './app/store'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} children={route}/>
  </Provider>,
  document.getElementById('root')
)
