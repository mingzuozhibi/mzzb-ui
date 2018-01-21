import {combineReducers} from 'redux'
import routingReducer from './routing'
import sessionReducer from './session'
import configReducer from './config'
import appbarReducer from './appbar'
import sakuraReducer from './sakura'

const rootReducer = combineReducers({
  routing: routingReducer,
  session: sessionReducer,
  config: configReducer,
  appbar: appbarReducer,
  sakura: sakuraReducer,
})

export {rootReducer}
