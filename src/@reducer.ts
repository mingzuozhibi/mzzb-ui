import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import { layoutReducer, LayoutState } from './reducers/layout'
import { sessionReducer, SessionState } from './reducers/session'
import { admin, AdminState } from './reducers/admin'

export interface RootState {
  admin: AdminState
  router: RouterState
  layout: LayoutState
  session: SessionState
}

export function createRootReducer(history: any) {
  return combineReducers({
    admin: admin,
    router: connectRouter(history),
    layout: layoutReducer,
    session: sessionReducer
  })
}
