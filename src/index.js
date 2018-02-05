import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {browserHistory, Router} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import route from './app/route'
import store from './app/store'
import {message} from 'antd'

const history = syncHistoryWithStore(browserHistory, store)

message.config({
  top: 75, duration: 1.5
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} children={route}/>
  </Provider>,
  document.getElementById('root')
)
