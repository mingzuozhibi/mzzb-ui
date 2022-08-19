import { adminReducer, AdminState } from '#F/admin'
import { layoutReducer, LayoutState } from '#F/layout'
import { sessionReducer, SessionState } from '#F/session'
import { connectRouter, RouterState } from 'connected-react-router'
import { combineReducers } from 'redux'

export interface RootState {
  admin: AdminState
  router: RouterState
  layout: LayoutState
  session: SessionState
}

export function createRootReducer(history: any) {
  return combineReducers({
    admin: adminReducer,
    router: connectRouter(history),
    layout: layoutReducer,
    session: sessionReducer,
  })
}
