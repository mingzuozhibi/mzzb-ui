import {LOCATION_CHANGE} from 'react-router-redux'
import {ACTION_SESSION_LOGIN, ACTION_SESSION_LOGOUT} from './constant'
import {getTitle} from './Drawer'
import {combineReducers} from 'redux'
import drawerReducer from './Drawer/module/reducer'
import alertReducer from './AlertDialog/module/reducer'
import loginReducer from './LoginDialog/module/reducer'

function sessionState(isLogged, userName, authRole) {
  return {isLogged, userName, authRole}
}

function sessionReducer(state = sessionState(false), action) {
  switch (action.type) {
    case ACTION_SESSION_LOGIN:
      const {userName, authRole} = action
      return sessionState(true, userName, authRole)
    case ACTION_SESSION_LOGOUT:
      return sessionState(false)
    default:
      return state
  }
}

function routerReducer(state = {}, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      const props = action.payload
      const title = getTitle(props.pathname)
      return {...state, title, ...props}
    default:
      return state
  }
}

const appbarReducer = combineReducers({
  drawer: drawerReducer,
  alert: alertReducer,
  login: loginReducer
})

export {sessionReducer, routerReducer, appbarReducer}
