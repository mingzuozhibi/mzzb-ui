import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import route from './app/route'
import store from './app/store'

injectTapEventPlugin()

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} children={route}/>
  </Provider>,
  document.getElementById('root')
)
