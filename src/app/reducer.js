import { combineReducers } from 'redux'
import { routerReducer as routingReducer } from 'react-router-redux'
import { sessionReducer, routerReducer } from './component/reducer'
import drawerReducer from './component/Drawer/module/reducer'
import alertReducer from './component/AlertDialog/module/reducer'
import loginReducer from './component/LoginDialog/module/reducer'

const reducer = combineReducers({
  routing: routingReducer,
  session: sessionReducer,
  router: routerReducer,
  drawer: drawerReducer,
  alert: alertReducer,
  login: loginReducer
})

export default reducer
