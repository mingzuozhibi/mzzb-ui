import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {browserHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'
import thunk from 'redux-thunk'
import {rootReducer} from './module/index'

const router = routerMiddleware(browserHistory)

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk, router),
))

export default store
