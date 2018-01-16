import {combineReducers} from 'redux'
import {routingReducer} from './routing'
import {sessionReducer} from './session'
import {appbarReducer} from './appbar'
import {sakuraReducer} from './sakura'

const rootReducer = combineReducers({
  routing: routingReducer,
  session: sessionReducer,
  appbar: appbarReducer,
  sakura: sakuraReducer,
})

export {rootReducer}
