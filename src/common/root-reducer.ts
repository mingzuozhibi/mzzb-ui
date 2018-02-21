import { combineReducers } from 'redux'
import { routerReducer, RouterState } from 'react-router-redux'

export interface RootState {
  router: RouterState
}

export const rootReducer = combineReducers({
  router: routerReducer,
})
