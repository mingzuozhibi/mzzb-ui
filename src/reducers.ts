import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import { layoutReducer, LayoutState } from './layout/layout'
import { sessionReducer, SessionState } from './layout/session'

export interface RootState {
  router: RouterState
  layout: LayoutState
  session: SessionState
}

export function createRootReducer(history: any) {
  return combineReducers({
    router: connectRouter(history),
    layout: layoutReducer,
    session: sessionReducer
  })
}
