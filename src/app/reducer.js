import {combineReducers} from 'redux'
import {routerReducer as routingReducer} from 'react-router-redux'
import {sessionReducer, routerReducer, appbarReducer} from './component/reducer'
import sakuraReducer from './page/Sakura/module/reducer'

const reducer = combineReducers({
  routing: routingReducer,
  session: sessionReducer,
  router: routerReducer,
  appbar: appbarReducer,
  sakura: sakuraReducer,
})

export default reducer
