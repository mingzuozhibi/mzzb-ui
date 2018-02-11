import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import sessionReducer from './reducers/sessionReducer'
import sakuraReducer from './reducers/sakuraReducer'
import layoutReducer from './reducers/layoutReducer'
import configReducer from './reducers/configReducer'
import userReducer from './reducers/userReducer'

export default combineReducers({
  user: userReducer,
  router: routerReducer,
  layout: layoutReducer,
  sakura: sakuraReducer,
  config: configReducer,
  session: sessionReducer,
})
