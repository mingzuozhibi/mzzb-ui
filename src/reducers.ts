import { combineReducers } from 'redux'
import { appReducer, AppState } from './app/reducer'
import { connectRouter, RouterState } from 'connected-react-router'

export interface RootState {
  app: AppState
  router: RouterState
}

export function createRootReducer(history: any) {
  return combineReducers({
    app: appReducer,
    router: connectRouter(history),
  })
}
