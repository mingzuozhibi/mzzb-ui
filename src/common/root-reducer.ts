import { combineReducers } from 'redux'
import { routerReducer, RouterState } from 'react-router-redux'
import { sakuraReducer, SakuraState } from '../components/sakura/reducer'

export interface RootState {
  sakura: SakuraState
  router: RouterState
}

export const rootReducer = combineReducers({
  router: routerReducer,
  sakura: sakuraReducer,
})

export interface BaseState<T> {
  models?: T[]
  errors?: string
}
